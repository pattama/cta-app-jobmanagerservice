# Job Manager Application Program Interface

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
