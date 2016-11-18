# Job Manager Data Contracts

## Input
* [Run a scenario](#run-a-scenario)
* [Receive a synchronize message](#receiver a synchronize message)

## Output
* [Acknowledge a message](#acknowledge-a-message)
* [Send a read message to agent](#send-a-read-message-to-agent)
* [Send a run message to agent](#send-a-run-message-to-agent)

### Run a scenario:
Contract:
```javascript
{
    "nature": {
        "type": "state",
        "quality": "create"
      },
    "payload": {
        "executionId": id(Execution),
        "timestamp": Long,
        "status": String,
        "index": Long,
        "hostname": String
    }
}
```
Example:
```javascript
{
    "nature": {
        "type": "state",
        "quality": "create"
      },
    "payload": {
        "executionId": "57c7edbc327a06452c50c984",
        "timestamp": 10,
        "status": "finished",
        "index": 1,
        "hostname": "mymachine"
    }
}
```
