## Classes

<dl>
<dt><a href="#BaseHelper">BaseHelper</a></dt>
<dd><p>Business Logic Helper Base class</p>
</dd>
<dt><a href="#Base">Base</a> ⇐ <code>Brick</code></dt>
<dd><p>Business Logic Base class</p>
</dd>
<dt><a href="#ExecutionCancelation">ExecutionCancelation</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Cancel class</p>
</dd>
<dt><a href="#ExecutionRequest">ExecutionRequest</a></dt>
<dd><p>Rest API client for Execution Data Service class</p>
</dd>
<dt><a href="#InstanceRequest">InstanceRequest</a></dt>
<dd><p>Rest API client for Instance Data Service class</p>
</dd>
<dt><a href="#JobManagerRun">JobManagerRun</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Run class</p>
</dd>
<dt><a href="#ExecutionTimeout">ExecutionTimeout</a> ⇐ <code><a href="#BaseHelper">BaseHelper</a></code></dt>
<dd><p>Business Logic Execution Helper Timeout class</p>
</dd>
<dt><a href="#Execution">Execution</a> ⇐ <code><a href="#Base">Base</a></code></dt>
<dd><p>Business Logic JobManager class</p>
</dd>
<dt><a href="#Messenger">Messenger</a></dt>
<dd><p>Messenger for interacting with CTA-IO</p>
</dd>
<dt><a href="#JobManagerHandler">JobManagerHandler</a></dt>
<dd><p>Handler class for RESTAPI handlers : JOBMANAGER</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getExecutionsUrl">getExecutionsUrl()</a> ⇒ <code>string</code></dt>
<dd><p>getExecutionsUrl - get execution url from config</p>
</dd>
<dt><a href="#getInstancesUrl">getInstancesUrl()</a> ⇒ <code>string</code></dt>
<dd><p>getInstancesUrl - get instance url from config</p>
</dd>
</dl>

<a name="BaseHelper"></a>

## BaseHelper
Business Logic Helper Base class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [BaseHelper](#BaseHelper)
    * [new BaseHelper(cementHelper, logger)](#new_BaseHelper_new)
    * *[._validate(context)](#BaseHelper+_validate) ⇒ <code>Promise</code>*
    * *[._process(context)](#BaseHelper+_process) ⇒ <code>Context</code>*

<a name="new_BaseHelper_new"></a>

### new BaseHelper(cementHelper, logger)
constructor - Create a new Business Logic Helper Base instance


| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |

<a name="BaseHelper+_validate"></a>

### *baseHelper._validate(context) ⇒ <code>Promise</code>*
Validates Context properties specific to this Helper

**Kind**: instance abstract method of <code>[BaseHelper](#BaseHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="BaseHelper+_process"></a>

### *baseHelper._process(context) ⇒ <code>Context</code>*
Process the context

**Kind**: instance abstract method of <code>[BaseHelper](#BaseHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Base"></a>

## Base ⇐ <code>Brick</code>
Business Logic Base class

**Kind**: global class  
**Extends:** <code>Brick</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |
| helpers | <code>Map.&lt;String, Helper&gt;</code> | Map of Helpers |


* [Base](#Base) ⇐ <code>Brick</code>
    * [new Base(cementHelper, configuration)](#new_Base_new)
    * [.validate(context)](#Base+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Base+process)

<a name="new_Base_new"></a>

### new Base(cementHelper, configuration)
constructor - Create a new Business Logic Base instance


| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |

<a name="Base+validate"></a>

### base.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[Base](#Base)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Base+process"></a>

### base.process(context)
Process the context

**Kind**: instance method of <code>[Base](#Base)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="ExecutionCancelation"></a>

## ExecutionCancelation ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Cancel class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [ExecutionCancelation](#ExecutionCancelation) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * [._validate(context)](#ExecutionCancelation+_validate) ⇒ <code>Promise</code>
    * [._process(context)](#ExecutionCancelation+_process)

<a name="ExecutionCancelation+_validate"></a>

### executionCancelation._validate(context) ⇒ <code>Promise</code>
Validates Context properties specific to this Helper

**Kind**: instance method of <code>[ExecutionCancelation](#ExecutionCancelation)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="ExecutionCancelation+_process"></a>

### executionCancelation._process(context)
Process the context

**Kind**: instance method of <code>[ExecutionCancelation](#ExecutionCancelation)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="ExecutionRequest"></a>

## ExecutionRequest
Rest API client for Execution Data Service class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [ExecutionRequest](#ExecutionRequest)
    * [.getExecution(executionId)](#ExecutionRequest+getExecution) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
    * [.updateExecution(id, executionData)](#ExecutionRequest+updateExecution) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
    * [.createExecution(executionData)](#ExecutionRequest+createExecution) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
    * [.createResult(resultData)](#ExecutionRequest+createResult) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
    * [.createState(stateData)](#ExecutionRequest+createState) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>

<a name="ExecutionRequest+getExecution"></a>

### executionRequest.getExecution(executionId) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Retrieve execution by execution ID

**Kind**: instance method of <code>[ExecutionRequest](#ExecutionRequest)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response  

| Param | Type | Description |
| --- | --- | --- |
| executionId | <code>string</code> | execution ID |

<a name="ExecutionRequest+updateExecution"></a>

### executionRequest.updateExecution(id, executionData) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Update execution for given executionId with executionData

**Kind**: instance method of <code>[ExecutionRequest](#ExecutionRequest)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | execution ID |
| executionData | <code>Object</code> |  |

<a name="ExecutionRequest+createExecution"></a>

### executionRequest.createExecution(executionData) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Create execution - send POST request

**Kind**: instance method of <code>[ExecutionRequest](#ExecutionRequest)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response  

| Param | Type |
| --- | --- |
| executionData | <code>Object</code> | 

<a name="ExecutionRequest+createResult"></a>

### executionRequest.createResult(resultData) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Create Result

**Kind**: instance method of <code>[ExecutionRequest](#ExecutionRequest)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response  

| Param | Type |
| --- | --- |
| resultData | <code>Object</code> | 

<a name="ExecutionRequest+createState"></a>

### executionRequest.createState(stateData) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Create State

**Kind**: instance method of <code>[ExecutionRequest](#ExecutionRequest)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response  

| Param | Type |
| --- | --- |
| stateData | <code>Object</code> | 

<a name="InstanceRequest"></a>

## InstanceRequest
Rest API client for Instance Data Service class

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |

<a name="InstanceRequest+getMatchingInstances"></a>

### instanceRequest.getMatchingInstances(matchingData) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Retrieve matching instances for given matchingData

**Kind**: instance method of <code>[InstanceRequest](#InstanceRequest)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response  

| Param | Type |
| --- | --- |
| matchingData | <code>Object</code> | 

<a name="JobManagerRun"></a>

## JobManagerRun ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Run class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [JobManagerRun](#JobManagerRun) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * [._validate(context)](#JobManagerRun+_validate) ⇒ <code>Promise</code>
    * [._process(context)](#JobManagerRun+_process)

<a name="JobManagerRun+_validate"></a>

### jobManagerRun._validate(context) ⇒ <code>Promise</code>
Validates Context properties specific to this Helper

**Kind**: instance method of <code>[JobManagerRun](#JobManagerRun)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="JobManagerRun+_process"></a>

### jobManagerRun._process(context)
Process the context

**Kind**: instance method of <code>[JobManagerRun](#JobManagerRun)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="ExecutionTimeout"></a>

## ExecutionTimeout ⇐ <code>[BaseHelper](#BaseHelper)</code>
Business Logic Execution Helper Timeout class

**Kind**: global class  
**Extends:** <code>[BaseHelper](#BaseHelper)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [ExecutionTimeout](#ExecutionTimeout) ⇐ <code>[BaseHelper](#BaseHelper)</code>
    * [._validate(context)](#ExecutionTimeout+_validate) ⇒ <code>Promise</code>
    * [._process(context)](#ExecutionTimeout+_process)

<a name="ExecutionTimeout+_validate"></a>

### executionTimeout._validate(context) ⇒ <code>Promise</code>
Validates Context properties specific to this Helper

**Kind**: instance method of <code>[ExecutionTimeout](#ExecutionTimeout)</code>  
**Overrides:** <code>[_validate](#BaseHelper+_validate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="ExecutionTimeout+_process"></a>

### executionTimeout._process(context)
Process the context

**Kind**: instance method of <code>[ExecutionTimeout](#ExecutionTimeout)</code>  
**Overrides:** <code>[_process](#BaseHelper+_process)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Execution"></a>

## Execution ⇐ <code>[Base](#Base)</code>
Business Logic JobManager class

**Kind**: global class  
**Extends:** <code>[Base](#Base)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| configuration | <code>BrickConfig</code> | cement configuration of the brick |
| helpers | <code>Map.&lt;String, Helper&gt;</code> | Map of Helpers |


* [Execution](#Execution) ⇐ <code>[Base](#Base)</code>
    * [.validate(context)](#Base+validate) ⇒ <code>Promise</code>
    * [.process(context)](#Base+process)

<a name="Base+validate"></a>

### execution.validate(context) ⇒ <code>Promise</code>
Validates Context properties

**Kind**: instance method of <code>[Execution](#Execution)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Base+process"></a>

### execution.process(context)
Process the context

**Kind**: instance method of <code>[Execution](#Execution)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Context</code> | a Context |

<a name="Messenger"></a>

## Messenger
Messenger for interacting with CTA-IO

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper instance |
| logger | <code>Logger</code> | logger instance |


* [Messenger](#Messenger)
    * [.getAllMessagesFromQueue(queue)](#Messenger+getAllMessagesFromQueue) ⇒ <code>Promise.&lt;Array.&lt;Job&gt;&gt;</code>
    * [.sendOneMessageToOneQueue(message, queue, options)](#Messenger+sendOneMessageToOneQueue) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
    * [.sendOneMessageToManyQueues(message, queues, options)](#Messenger+sendOneMessageToManyQueues) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
    * [.sendManyMessagesToOneQueue(messages, queue, options)](#Messenger+sendManyMessagesToOneQueue) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
    * [.acknowledgeMessage(ackId)](#Messenger+acknowledgeMessage) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>

<a name="Messenger+getAllMessagesFromQueue"></a>

### messenger.getAllMessagesFromQueue(queue) ⇒ <code>Promise.&lt;Array.&lt;Job&gt;&gt;</code>
Retrieve all messages of given queue name

**Kind**: instance method of <code>[Messenger](#Messenger)</code>  
**Returns**: <code>Promise.&lt;Array.&lt;Job&gt;&gt;</code> - - resolves array of job  

| Param | Type | Description |
| --- | --- | --- |
| queue | <code>string</code> | queue name |

<a name="Messenger+sendOneMessageToOneQueue"></a>

### messenger.sendOneMessageToOneQueue(message, queue, options) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Send a message to a queue

**Kind**: instance method of <code>[Messenger](#Messenger)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response - response from CTA-IO  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | CTA Job |
| queue | <code>string</code> | queue name |
| options | <code>Object</code> |  |
| options.autodelete | <code>boolean</code> |  |
| options.expires | <code>number</code> | milliseconds to delete queue |

<a name="Messenger+sendOneMessageToManyQueues"></a>

### messenger.sendOneMessageToManyQueues(message, queues, options) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Send a message to many queues

**Kind**: instance method of <code>[Messenger](#Messenger)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response - response from CTA-IO  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | CTA Job |
| queues | <code>Array.&lt;string&gt;</code> | array of queue name |
| options | <code>Object</code> |  |
| options.autodelete | <code>boolean</code> |  |
| options.expires | <code>number</code> | milliseconds to delete queue |

<a name="Messenger+sendManyMessagesToOneQueue"></a>

### messenger.sendManyMessagesToOneQueue(messages, queue, options) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Send many messages to a queue

**Kind**: instance method of <code>[Messenger](#Messenger)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response - response from CTA-IO  

| Param | Type | Description |
| --- | --- | --- |
| messages | <code>Array.&lt;Object&gt;</code> | array of CTA Job |
| queue | <code>string</code> | queue name |
| options | <code>Object</code> |  |
| options.autodelete | <code>boolean</code> |  |
| options.expires | <code>number</code> | milliseconds to delete queue |

<a name="Messenger+acknowledgeMessage"></a>

### messenger.acknowledgeMessage(ackId) ⇒ <code>Promise.&lt;Object&gt;</code> &#124; <code>string</code> &#124; <code>string</code> &#124; <code>\*</code>
Acknowledge message

**Kind**: instance method of <code>[Messenger](#Messenger)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - result<code>string</code> - result.returnCode - done|reject|error<code>string</code> - result.brickName<code>\*</code> - result.response - response from CTA-IO  

| Param | Type |
| --- | --- |
| ackId | <code>string</code> | 

<a name="JobManagerHandler"></a>

## JobManagerHandler
Handler class for RESTAPI handlers : JOBMANAGER

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper from a cta-restapi Brick |


* [JobManagerHandler](#JobManagerHandler)
    * [new JobManagerHandler(cementHelper)](#new_JobManagerHandler_new)
    * [.actions(req, res)](#JobManagerHandler+actions)
    * [.cancel(req, res)](#JobManagerHandler+cancel)
    * [.timeout(req, res)](#JobManagerHandler+timeout)

<a name="new_JobManagerHandler_new"></a>

### new JobManagerHandler(cementHelper)

| Param | Type | Description |
| --- | --- | --- |
| cementHelper | <code>CementHelper</code> | cementHelper from a cta-restapi Brick |

<a name="JobManagerHandler+actions"></a>

### jobManagerHandler.actions(req, res)
Redirect to cancel/timeout method

**Kind**: instance method of <code>[JobManagerHandler](#JobManagerHandler)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req |  |  |
| req.body.action | <code>string</code> | cancel|timeout |
| res |  |  |

<a name="JobManagerHandler+cancel"></a>

### jobManagerHandler.cancel(req, res)
Publishes request params in an execution-cancel Context

**Kind**: instance method of <code>[JobManagerHandler](#JobManagerHandler)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req |  |  |
| req.params.id | <code>string</code> | execution ID |
| req.params.instances | <code>Array.&lt;Instance&gt;</code> | array of instances |
| res |  |  |

<a name="JobManagerHandler+timeout"></a>

### jobManagerHandler.timeout(req, res)
Publishes request params in an execution-timeout Context

**Kind**: instance method of <code>[JobManagerHandler](#JobManagerHandler)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req |  |  |
| req.params.id | <code>string</code> | execution ID |
| req.params.instances | <code>Array.&lt;Instance&gt;</code> | array of instances |
| res |  |  |

<a name="getExecutionsUrl"></a>

## getExecutionsUrl() ⇒ <code>string</code>
getExecutionsUrl - get execution url from config

**Kind**: global function  
**Returns**: <code>string</code> - url  
<a name="getInstancesUrl"></a>

## getInstancesUrl() ⇒ <code>string</code>
getInstancesUrl - get instance url from config

**Kind**: global function  
**Returns**: <code>string</code> - url  
