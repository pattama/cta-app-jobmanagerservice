# Job Manager DataService for Compass Test Automation
[Readme](README.md) | [Rest API](RESTAPI.md) | [DataContract](DATACONTRACT.md) | [Document](DOCUMENTATION.md) | [Sequence Diagrams](https://www.lucidchart.com/documents/edit/d15cef2b-8b80-4ce0-8e2c-1f3deee1759c/0)


## Job Manager Application Program Interface

#### Rest API
* [Cancel an execution](#cancel-an-execution)
* [Trigger execution timeout](#trigger-execution-timeout)

#### Cancel an execution
**Request**
```ruby
POST /jobmanager/execution/:id/actions
{
  "action": "cancel",
  "instances": [{
    "hostname": "mymachine",
    "state": "pending"
  }]
}
```

**Response**
```ruby
200
```

#### Trigger execution timeout
**Request**
```ruby
POST /jobmanager/execution/:id/actions
{
  "action": "timeout",
  "instances": [{
    "hostname": "mymachine",
    "state": "pending"
  }]
}
```
**Response**
```ruby
200
```
