# Inferno Core
[![Test Coverage](https://api.codeclimate.com/v1/badges/49895e81b0fe7bd04756/test_coverage)](https://codeclimate.com/github/inferno-community/inferno-core/test_coverage)

**Inferno Core is currently in alpha status**

Inferno Core is an open source tool for testing data exchanges enabled by the [Fast
Healthcare Interoperability Resources (FHIR)](http://hl7.org/fhir/) standard. 

## Requirements
Inferno Core requires [Ruby 2.7+](https://www.ruby-lang.org/en/) and [Node.js
and NPM](https://www.npmjs.com/get-npm).

## Running Inferno Core

### Docker
It is recommended that you run Inferno Core via Docker.
```
docker build -t inferno-core .
docker run -p 4567:4567 inferno-core
```

Inferno Core can then be accessed by navigating to
[http://localhost:4567](http://localhost:4567)

### Natively
```
# Install dependencies
npm install
bundle install

# Start Inferno Core server and UI
npm run dev
```

Inferno Core can then be accessed by navigating to
[http://localhost:4567](http://localhost:4567)

To only run the server (JSON API with no UI): `bundle exec puma`

## Documentation
Documentation for the JSON API is located in
[docs/swagger.yml](docs/swagger.yml) The contents of this file can be pasted
into the [Swagger Editor](https://editor.swagger.io/) for an interactive view.


Documentation for the ruby code can be generated by running `bundle exec
bin/docs`. This documentation will be located in `docs/yard`.

## Running tests via JSON API
With the server running, first retrieve a list of available test suites:
```
GET http://localhost:4567/api/test_suites
```
See the details of a test suite:
```
GET http://localhost:4567/api/test_suites/TEST_SUITE_ID
```
Then create a test session for the suite you want to use:
```
POST http://localhost:4567/api/test_sessions?test_suite_id=TEST_SUITE_ID
```
Tests within a suite are organized in groups. Create a test run to run an entire
suite, a group, or an individual test. Only one of `test_suite_id`,
`test_group_id`, or `test_id` should be provided.
```
POST http://localhost:4567/api/test_runs
{
  "test_session_id": "TEST_SESSION_ID",
  "test_suite_id": "TEST_SUITE_ID",
  "test_group_id": "TEST_GROUP_ID",
  "test_id": "TEST_ID",
  "inputs": [
    {
      "name": "input1",
      "value": "input1 value"
    },
    {
      "name": "input2",
      "value": "input2 value"
    }
  ]
}
```
Then you can view the results of the test run:
```
GET http://localhost:4567/api/test_runs/TEST_RUN_ID/results
or
GET http://localhost:4567/api/test_sessions/TEST_SESSION_ID/results
```

## Development
To get to an interactive console, run `bundle exec bin/console`

## License
Copyright 2021 The MITRE Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at
```
http://www.apache.org/licenses/LICENSE-2.0
```
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
