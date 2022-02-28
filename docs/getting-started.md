---
title: Getting Started
nav_order: 4
---
# Getting Started
{: .no_toc}

## Table of Contents
{: .no_toc .text-delta}

1. TOC
{:toc}
---
## Getting Started for Inferno Users
Start here if you're interested in testing a FHIR server against one or more existing Test Kits.

### A Single Test Kit
Most Test Kits are developed using the [Inferno Template 
repository](https://github.com/inferno-framework/inferno-template) which provides scripts for standing up
an instance of Inferno to run a selected Test Kit.

e.g. the [US Core Test Kit](https://github.com/inferno-framework/us-core-test-kit)

```sh
git clone https://github.com/inferno-framework/us-core-test-kit.git
./setup.sh
./run.sh
```

Always check the documentation for an individual Test Kit since they may differ from this standard approach.

### Multiple Test Kits
There may be times when you wish to offer multiple test kits in a single Inferno instance. There may be times when you wish to run multiple, different Test Kits through a single Inferno instance. You can load and run two or more separate Test Kits by using [Inferno Template](https://github.com/inferno-framework/inferno-template).

To create and deploy a custom combination of Test Kits with the Inferno Template first create a new repository based off the template or clone the template:

```sh
git clone https://github.com/inferno-framework/inferno-template.git
```

Add Test Kits you want to include to the `Gemfile`:

```ruby
gem 'smart_app_launch_test_kit',
    git: 'https://github.com/inferno-framework/smart-app-launch-test-kit.git',
    branch: 'main'
gem 'us_core_test_kit',
    git: 'https://github.com/inferno-framework/us-core-test-kit.git',
    branch: 'main'
```

To enable the Test Kits, require them in in `lib/inferno_template.rb`:

```ruby
require 'smart_app_launch_test_kit'
require 'us_core_test_kit'
```

Inferno relies on external validation services for profile validation; by default, Inferno uses the [FHIR Validator Wrapper](https://github.com/inferno-framework/fhir-validator-wrapper). For Test Kits that require profile validation,
such as the US Core Test Kit, the corresponding Implementation Guide will need to be placed in the `lib/inferno_deployment/igs/` directory as a _.tgz_ file (i.e. _package.tgz_).
The Implementation Guide files for a Test Kit can be located in that kit's git repository and just copied over directly: 

e.g. for the US Core Test Kit
```sh
git clone https://github.com/inferno-framework/us-core-test-kit.git
cp -a /us-core-test-kit/lib/us_core/igs/. /inferno_template/lib/inferno_template/igs/
```

Once this is done you can build and run the instance:

```sh
./setup.sh
./run.sh
```

_Note: Example Test Suites, Groups, Tests and IGs in the template can be removed._

## Getting Started for Inferno Test Writers

### Installation
1. Install [Docker](https://www.docker.com/get-started).
1. Clone the [Inferno Template
   repository](https://github.com/inferno-framework/inferno-template). You can
   either clone this repository directly, or click the green "Use this template"
   button to create your own repository based on this one.
1. Run `./setup.sh` in the template repository to retrieve the necessary docker
   images and create a database.
   
### Running Inferno
After installation, run the `./run.sh` script to start Inferno.
- Navigate to [localhost](http://localhost) to access Inferno and run test
  suites.
- Navigate to [localhost/validator](http://localhost/validator) to access a
  standalone validator that can be used to validate individual FHIR resources.

### Next Steps
Now that Inferno is running, you could learn about [the file/directory
organization](/inferno-core/repo-layout-and-organization.html) or just start
[writing tests](/inferno-core/writing-tests).
