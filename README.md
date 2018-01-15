# cta-app-jobmanagerservice
[![build status](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/commits/master)[![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-app-jobmanagerdataservice/commits/master)

**JobManager Data Service Application (JMS)**  for Compass Test Automation, implementing CTA-OSS Framework

## General Overview

### Overview
JobManager Data Service (JMS) performing as a brick between CTA-Execution-DataService(EDS) and CTA-Agent. JMS will receive commands from EDS. Then JMS will transform commands and send them to CTA-Agent(s). Many agents may receive these commands according to `mode` field.

For detail, please go to our [**CTA Main Repository**](https://github.com/thomsonreuters/cta).

### Features
  * __Mono mode__: send a command to single CTA-Agent. If there are many CTA-Agents matching the condition, first CTA-Agent will be chosen.
  * __Stress mode__: send a command to matching CTA-Agent. If there are many CTA-Agents matching the condition, JMS will send the same command to all.
  * __Group mode__: send a command to single CTA-Agent. If there are many CTA-Agents matching the condition, First, not-busy, CTA-Agent will pick up the command.
  * __Parallel mode__: send many commands to matching CTA-Agent. If there are many CTA-Agents matching the condition, Not-busy CTA-Agent(s) will help each other picking up the commands.
  
## Guidelines

* [Getting Start](#getting-start)
  * [Prerequisites](#prerequisites) 
  * [Installation & Startup](#installation-startup)
* [Development Guide](#development-guide)
  * [Contributing](#contributing)
  * [More Information](#more-information)

## Getting Start

### Prerequisites
 1. Front End skills required include `HTML`, `CSS`, `JavaScript`, `JSON`. 
 2. Back End development using `Node.js`, `Express,` and `MongoDB`. It also important concept of source control using `Git`.

### Installation & Startup
The easiest way to get started is to clone the repository:
```bash
git clone git@git.sami.int.thomsonreuters.com:compass/cta-app-executiondataservice.git
```
Then install NPM dependencies:
```bash
npm install
```
To build, be sure you have [node](https://nodejs.org/en/) installed.

## Development Guide

### Contributing
You can follow [these steps](https://github.com/thomsonreuters/cta/blob/master/contributing.md) to contribute.

### More Information
Our service is composed of different components working together to schedule, run, collect tests results and more. You can find additional information for more understand in Execution Data Service.
We also cover in detail :
* The Rest API is composed of multiple REST service to perform actions on CTA.
* A DataContract is a formal agreement between a bricks.
* The Document associated with a software project and the system being.
* A Sequence Diagrams is an interaction diagram that shows how objects operate with one another and in what order.
