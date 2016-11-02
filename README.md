# Application Scheduler for Compass Test Automation


* [App Configuration](#app-configuration)
#### Contract
* Rabbit MQ
  * [Run an execution](#run-an-execution)
* Rest API
  * [Cancel an execution](#cancel-an-execution)

###App config
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
