# Application Job Manager for Compass Test Automation


* [App Configuration](#app-configuration)

## Contract In
* Rabbit MQ
  * [Run an execution](#run-an-execution)
* Rest API
  * [Cancel an execution](#cancel-an-execution)

## Contract Out
* Rabbit MQ
    * [Run Message](#run-message)
    * [Read Message](#read-message)

## App configuration
```
{
  executionsUrl: '',
  instancesUrl: '',
}
```

## Run an execution
```
{
"nature": {
	"type": "execution",
	"quality": "run"
},
"payload": {
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
		"inputRepository": [{
			"type": "git",
			"url": "https://….git",
			"mountpoint": "C:/temp"
		}],
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
		"properties": [
		{
		  "name": "testname",
		  "value": "testvalue"
		}
	  ]
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


## Cancel an execution
```
POST /jobmanager/execution/:id/action
{
  "action": "cancel",
  "state": "",
  "instances": []
}
```

## Contract out
CTA-JobManager will send the message to the agent via CTA-IO. There are 2 types of message.
1. Run message
2. Read message

## Run message
source: https://docs.google.com/document/d/1bxfFkWxAfYkMFGZZn--_MLkZ7WXz4AAym44YXtnHcX4/edit
```
{
    "nature": {
        "type": "message",
        "nature": "produce"
    },
    "payload": {
        "nature": {
            "type": "execution",
            "quality": "run"
        },
        "payload": {
    	    "execution": {
    		    "id": Identifier,
                "requestTimestamp": Number,
    		    "pendingTimeout": Number,
    		    "runningTimeout": Number
            },
    	    "testSuite": {
    		    "id": Identifier,
    		    "name": String,
    		    "tests": [{
    			    "id": Identifier,
    			    "name": String,
    			    "description": String,
    			    "type": String, 	// commandLine...
    			    "stages": [{
    			    	"name": "stage",
    			    	"run": "notepad.exe",
    			    	"stop": "echo Test - Do stop operations...",
    			    	"cwd": "C:\\tmp",
    			    	"env": [{
    			    		"key": "foo", "value": "bar", // user values
    			    		"key": "CTA_EXECUTION_DIR" : "value": execution.id // added by jobmanager
    			    	}],
    				"mandatory": true,
    				"timeout": 1000
    			}]
    		}]
    	}
    }
}
```

## Read Message
```
{
    "nature": {
        "type": "message",
        "quality": "produce"
    },
    "payload": {
        "nature": {
            "type": "execution",
            "quality": "read"
        },
      "payload": {
    	"execution": {
    		"id": Identifier,
            "requestTimestamp": Number,
    		"pendingTimeout": Number,
    		"runningTimeout": Number
    	},
    	"queue": String 		// probably the execution.id
       }
    }
}    

```