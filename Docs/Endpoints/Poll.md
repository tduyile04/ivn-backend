# API endpoints

## Version 1.0
BASE URL `/api/v1`

### Poll

#### Create poll
[POST] `/polls`

Authorization:
- Admin
- Super Admin

Restrictions:
- All body params must be of required data type(see below)
- Only admin and super admin can perform this action
- Poll name cannot be more than 255 characters
- Poll must have a valid level. One of [federal, state, localGovernment]
- If Poll has country, country must be a valid one. Currently only one country is supported 'nigeria'
- If Poll has state, state must be a valid one. All 36 states in Nigeria are supported.
- if Poll has localGovernment, localGovernment must be a valid one. All localGovernments in nigeria are supported.

Body params:
- name [STRING] [REQUIRED] : name of poll
- country [STRING] : counntry where poll is active
- state [STRING] : state where poll is active
- localGovernment [STRING]: local government where poll is active
- level [STRING] : if exist, must be one of [federal, state, local_government]

Example request:
```js
request
  .post('/api/v1/polls')
  .send({
    name: 'Lagos State General Election', 
    country: 'Nigeria',
    state: 'Lagos',
    level: 'state'
  .end((err, res) => {
    console.log(res.body)
  })
```

Example success response:
```json
{
  "status": {
    "code": 201,
    "message": "success"
  },
  "data": {
    "poll": {
      "id": "8c6987f4-3dd3-49d9-87ea-88c98b4a97e7",
      "name": "Lagos State General Election",
      "level": "state",
      "winner": null,
      "country": "Nigeria",
      "state": "Lagos",
      "local_government": null,
      "is_active": true,
      "created_at": "2018-08-12T18:42:12.402Z",
      "updated_at": "2018-08-12T18:42:12.402Z"
    }
  }
}
```

Example error response:
```json
{
    "status": {
        "code": 400, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```
---

#### Fetch all polls
[GET] `/polls`

Authorization:
- Basic

Query params:
- country [STRING] : countries where poll is active
  - this filter allows for multiple options. i.e pick a poll that is in at least one or more of these countries
  - seperate countries by `,` .i.e. `?country=england,nigeria,ghana`
- state [STRING] : states where poll is active
  - this filter allows for multiple options. i.e pick a poll that is in at least one or more of these states
  - seperate states by `,` .i.e. `?state=lagos,kansas,kentucky`
- local [STRING]: local governments where poll is active
  - this filter allows for multiple options. i.e pick a poll that is in at least one or more of these local government
  - seperate local government by `,` .i.e. `?local=alimosho,iseyin`
- level [STRING] : levels of poll
  - this filter allows for multiple options. i.e pick a poll that is in at least one or more of these levels
  - seperate level by `,` .i.e. `?level=federal,state`
- limit [Number] number of users per page
- page [Number] data page

Example request:
```js
request
  .get('/api/v1/polls/?country=USA,Nigeria&local=Maryland,alimosho&level=local')
  .end((err, res) => {
    console.log(res.body)
  })
```

Example success response:
```json
{
  "status": {
    "code": 200,
    "message": "success"
  },
  "data": {
    "polls": [
      {
        "id": "1e91e732-5bdd-4191-ba54-4c86724cf27d",
        "name": "Alimosho LG Election",
        "level": "local",
        "winner": [],
        "country": "Nigeria",
        "state": "Lagos",
        "local_government": "Alimosho",
        "created_at": "2018-08-12T20:10:57.764Z",
        "candidates": [],
        "voters": [],
        "disqualified": []
      }
    ]
  },
  "metadata": {
    "total": 1,
    "perPage": 10,
    "totalPage": 1,
    "page": 1
  }
}
```

Example error response:
```json
{
    "status": {
        "code": 400, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```
---
