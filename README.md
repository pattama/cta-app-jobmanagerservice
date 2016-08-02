#How to use
- clone this repository, you should clone this repo. to your expected brick name
  - `git clone git@git.sami.int.thomsonreuters.com:compass/cta-brick-boilerplate.git cta-[brickname]`
- if you don't have nvm please install it by npm install -g nvm
- change name and description in package.json to be your brick
- run npm install

##You can change git remote point to your brick repo.
- `git remote set-url origin [git url]` or deleting `.git` folder then do git init and set to repo.

###config
```
{
  executionsUrl: '',
  instancesUrl: '',
}
```

##creation execution
```
{
  "id": "execution-1",
  "nature": {
    "type": "execution",
    "quality": "creation"
  },
  "payload": {
    "scenario": {
      "id": "1111111111",
      "name": "testScenario",
      "description": "Test scenario",
      "scopetested": "",
      "testsuites": [
        {
          "id": "1231231232",
          "name": "testTestSuite",
          "applicationtested": "",
          "parent": ""
        }
      ],
      "configuration": {
        "id": "1232131232",
        "name": "testConfig",
        "targetmode": "",
        "runmode": "mono",
        "type": "physical",
        "properties": [
          {
            "name": "testname",
            "value": "testvalue"
          }
        ]
      },
      "pendingtimeout": 1000,
      "runningtimeout": 1000,
      "scheduled": true
    },
    "user": {}
  }
}```
