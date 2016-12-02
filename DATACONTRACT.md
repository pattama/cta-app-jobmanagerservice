# Job Manager DataService for Compass Test Automation
[Readme](README.md) | [Rest API](RESTAPI.md) | [DataContract](DATACONTRACT.md) | [Document](DOCUMENTATION.md) |[Configuration](Config.js)| [Sequence Diagrams](https://www.lucidchart.com/documents/edit/d15cef2b-8b80-4ce0-8e2c-1f3deee1759c/0)


## Job Manager Data Contracts

### Input
* [Run a scenario](#run-a-scenario)

### Output
* [Acknowledge a message](#acknowledge-a-message)
* [Send a read message to agent](#send-a-read-message-to-agent)
* [Send a run message to agent](#send-a-run-message-to-agent)

#### Run a scenario:
Contract:
```ruby
{
    "nature": {
        "type": "scenario",
        "quality": "run"
    },
    "payload": {
        "requestTimestamp" : Timestamp,
        "scenario": {
            "id": id(Scenario,
            "name": String,
            "description": String,
            "scopetested": String,
            "pendingTimeout": Long,
            "runningTimeout": Long,
            "scheduled": boolean,
            "testSuite": {
		        "id": id(TestSuite),
                "name": String,
                "tests": [{
                    "id": id(Test),
                    "name": String,
                    "description": String,
                    "type": String,
                    "stages": [{
                        "name": String,
                        "run": String,
                        "stop": String,
                        "cwd": String,
                        "mandatory": boolean,
                        "timeout": Long
                    }]
                }]
		    }
        },
        "configuration": {
            "id": id(Configuration),
            "name": String,
            "targetmode": String,
            "runMode": String,
            "type": String,
            "properties": [{
                "name": "value"
            }]
        },
        "user": {
            "id": id(User),
            "first": String,
            "last": String,
            "uid": String
        }
    }
}
```
Example:
```ruby
{
    "nature": {
        "type": "scenario",
        "quality": "run"
    },
    "payload": {
        "requestTimestamp" : 1478684460000,
        "scenario": {
            "id": "57e0e3ff7f256e3368cc4ecb",
            "name": "testScenario",
            "description": "Test scenario",
            "scopetested": "",
            "pendingTimeout": 300000,
            "runningTimeout": 300000,
            "scheduled": true,
            "testSuite": {
                "id": "57e0e3ff7f256e3368cc4ecb",
                "name": "Testsuite",
                "tests": [{
                    "id": "57e0e3ff7f256e3368cc4ecb",
                    "name": "Test 1",
                    "description": "test test",
                    "type": "commandLine",
                    "stages": [{
                        "name": "stage",
                        "run": "notepad.exe",
                        "stop": "echo Test - Do stop operations...",
                        "cwd": "C:\\tmp",
                        "mandatory": true,
                        "timeout": 300000
                    }]
                }, {
                    "id": "57e0e3ff7f256e3368cc4ecb",
                    "name": "Test 1",
                    "description": "test test",
                    "type": "commandLine",
                    "stages": [{
                        "name": "stage",
                        "run": "mspaint.exe",
                        "stop": "echo Test - Do stop operations...",
                        "cwd": "C:\\tmp",
                        "mandatory": true,
                        "timeout": 300000
                    }]
                }]
            }
        },
        "configuration": {
            "id": "57e0e3ff7f256e3368cc4ecb",
            "name": "testConfig",
            "targetmode": "",
            "runMode": "mono",
            "type": "physical",
            "properties": [{
                "name": "value"
            }]
        },
        "user": {
            "id": "57e0e3ff7f256e3368cc4ecb",
            "first": "Manassorn",
            "last": "Vanichdilokkul",
            "uid": "6029457"
        }
    }
}
```


#### Acknowledge a message
Contract:
```ruby
Contract:
{
    "nature": {
	"type": "message",
	"quality": "acknowledge",
    },
    "payload": {
        "id": id(AcknowledgeId)
    }
}
```
Example:
```ruby
{
    "nature": {
	"type": "message",
	"quality": "acknowledge",
    },
    "payload": {
        "id": "57c7edbc327a06452c50c984"
    }
}
```

#### Send a read message to agent
Contract:
```ruby
{
    "nature": {
	"type": "execution",
	"quality": "read"
    },
    "payload": {
	"execution": {
	    "id": id(Execution),
	    "requestTimestamp": Timestamp,
	    "pendingTimeout": Long,
	    "runningTimeout": Long,
	},
	"queue": String
    }
}
```
Example:
```ruby
{
    "nature": {
	"type": "execution",
	"quality": "read"
    },
    "payload": {
	"execution": {
	    "id": "57c7edbc327a06452c50c984",
	    "requestTimestamp": 1479713266718,
	    "pendingTimeout": 10000,
	    "runningTimeout": 10000,
	},
	"queue": "sharedQueue"
    }
}
```

#### Send a run message to agent
Contract:
```ruby
{
    "nature": {
        "type": "execution",
        "quality": "run"
    },
    "payload": {
        "execution": {
            "id: id(Execution),
            "requestTimestamp": Timestamp,
            "pendingTimeout": Long,
            "runningTimeout": Long
	    },
	    testSuite
    }
}
```
Example:
```ruby
{
    "nature": {
        "type": "execution",
        "quality": "run"
    },
    "payload": {
        "execution": {
            "id: "57c7edbc327a06452c50c984",
            "requestTimestamp": 1479713266718,
            "pendingTimeout": 10000,
            "runningTimeout": 10000
	    },
	    testSuite
    }
}
```
