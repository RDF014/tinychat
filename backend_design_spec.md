Here is where your spec/explanation to the tinychat backend developer goes.

POST:
- to '/message'
- create a new entry for messages
- accepts an object with these properties and their data types
```
body = {
  author: string,
  timestamp: integer,
  content: string
}
```
- expect 
- **handle unique message ID creation**

GET:
- to '/message/all'
_ expect a JSON object in the same format as fakedata.json

PUT:
- to '/message/:id'
- update an entry with the given ID parameter
  - will also add the last_edited property depending if this is the first instance of the object being updated
- accepts an object with these properties and their data types
```
body = {
  content: string,
  last_edited: 
}
```