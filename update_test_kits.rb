# NOTE: DO NOT RUN THIS SCRIPT WITH `bundle exec`. The `bundle update` command
# will not work if this script is run using `bundle exec`. Instead of updating
# the test kits dependencies, it will update inferno core's dependencies.

# This script updates the ruby dependencies in all of the test kits in the
# inferno-framework github organization. For each repository ending in
# "test-kit", it will:
# * Perform a clone into the "tmp" directory
# * Create a new branch "dependency-updates-YYYY-MM-DD"
# * Run "bundle update"
# * Push the branch to github if there have been any changes
# * Create a PR if a github API key has been provided

require 'pry'
require 'faraday'
require 'json'

access_token = ENV['GITHUB_ACCESS_TOKEN']

test_kit_repos = []
next_link = 'https://api.github.com/orgs/inferno-framework/repos'

loop do
  response = Faraday.get next_link
  json_body = JSON.parse(response.body)
  test_kit_repos.concat(json_body.select { |repo| repo['name'].end_with? 'test-kit' })

  link_header = response.headers['link']

  break if link_header.nil?

  next_link =
    link_header
      .split(',')
      .find { |link| link.end_with? 'rel="next"' }
      &.split(';')
      &.first

  break if next_link.nil?

  # Remove <> around url
  next_link = next_link[1, next_link.length - 2]
end

Dir.mktmpdir do |dir|
  Dir.chdir(dir)

  puts "\nCloning repos into #{dir}\n"

  test_kit_repos.each do |repo|
    repo_url = repo['ssh_url']
    puts "* Cloning #{repo['name']}"
    `git clone #{repo_url}`
    Dir.chdir(repo['name'])
    date_string = DateTime.now.iso8601[0, 10]
    branch_name = "dependency-updates-#{date_string}"
    puts "* Running bundle update"
    `bundle update`
    git_status = `git status`

    if !git_status.include? 'Changes not staged for commit:'
      binding.pry
      puts "* No updates for #{repo['name']}.\n"
      Dir.chdir(dir)
      next
    end

    puts "* Creating branch #{branch_name} and committing updates"
    `git checkout -b #{branch_name}`
    `git commit -am "update dependencies"`
    puts "* Pushing"
    system "git push -u origin #{branch_name}"

    if access_token.nil?
      puts "\n* No access token provided. Skipping PR creation.\n"
      next
    end

    connection = Faraday.new(
      url: 'https://api.github.com',
      headers: {
        'Content-Type' => 'application/json',
        'X-GitHub-Api-Version' => '2022-11-28',
        'Accept' => 'application/vnd.github+json',
        'Authorization' => "Bearer #{access_token}"
      }
    )
    pr_response =
      connection.post("/repos/inferno-framework/#{repo['name']}/pulls") do |request|
        request.body = {
          title: "Dependency Updates #{date_string}",
          head: branch_name,
          base: 'main'
        }.to_json
      end
    # Check response for 201 status
    if pr_response.status != 201
      puts "* Error opening PR"
    end
    Dir.chdir(dir)
  end
end

puts 'DONE'
