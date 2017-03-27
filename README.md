# JobManager Data Service for Compass Test Automation

[![build status](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/commits/master)[![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/commits/master)
------
* General Overview
  * [Overview](#overview)
  * [Features](#features)
* Getting Started
  * [Install](#Getting-Started)
* Development Guide
  * [Contributing](#contributing)
  * [More Information](#more-information)
  
------

## General Overview
### Overview
JobManager Data Service (JMS) performing as a brick between CTA-Execution-DataService(EDS) and CTA-Agent. JMS will receive commands from EDS. Then JMS will transform commands and send them to CTA-Agent(s). Many agents may receive these commands according to `mode` field.

### Features
  * __Mono mode__: send a command to single CTA-Agent. If there are many CTA-Agents matching the condition, first CTA-Agent will be chosen.
  * __Stress mode__: send a command to matching CTA-Agent. If there are many CTA-Agents matching the condition, JMS will send the same command to all.
  * __Group mode__: send a command to single CTA-Agent. If there are many CTA-Agents matching the condition, First, not-busy, CTA-Agent will pick up the command.
  * __Parallel mode__: send many commands to matching CTA-Agent. If there are many CTA-Agents matching the condition, Not-busy CTA-Agent(s) will help each other picking up the commands.
  

You can check more [feature guide](https://git.sami.int.thomsonreuters.com/compass/cta/blob/master/features.md) for a list of all features provided by CTA-OSS.

------

## Getting Started
The easiest way to get started is to clone the repository:
```ruby
git clone git@git.sami.int.thomsonreuters.com:compass/cta-app-jobmanagerdataservice.git
```
Then install NPM dependencies:
```ruby
npm install
```
To build, be sure you have [node](https://nodejs.org/en/) installed.

------

## Development Guide
### Contributing
You can follow [these steps](https://git.sami.int.thomsonreuters.com/compass/cta/blob/master/contributing.md) to contribute.

### More Information
Our service is composed of different components working together to schedule, run, collect tests results and more. You can find additional information for more understand in Execution Data Service.
We also cover in detail :
* The [Rest API](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/wikis/rest%20api) is composed of multiple REST service to perform actions on CTA.
* A [DataContract](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/wikis/datacontract) is a formal agreement between a bricks.
* The [Document](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/wikis/document) associated with a software project and the system being.
* A [Sequence Diagrams](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/wikis/sequence%20diagram) is an interaction diagram that shows how objects operate with one another and in what order.

------

This code is running live at [CTA-OSS](https://www.). We also have [CTA Central Document](https://git.sami.int.thomsonreuters.com/compass/cta) 