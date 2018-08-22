# API endpoints

## Version 1.0
BASE URL `/api/v1`

### Party

#### Create party
[POST] `/parties`

Authorization:
- Basic
- Admin

Restrictions:
- All body params must be of required data type(see below)
- Only admin and super admin can perform this action
- Cannot update to a name that already exists
- avatar must be a valid url and format [jpeg, png, jpg]

Body params:
- name [STRING] [REQUIRED] : name of party
- bio [STRING] : bio of party
- avatar [STRING] : avatar image url of party
- manifesto [STRING] : party's manifesto
- motto [STRING] : party's motto
- slogan [STRING] : party's slogan
- about [STRING] : about the party

Example request:
```js
request
  .post('/api/v1/parties')
  .send({
    name: 'WEE', // [String, required]
    avatar: 'WEE.jpeg', // [String]
    bio: 'xxxy' // [String]
  })
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

#### Add a member

[POST] `/party/:party_id/members`

Authorization:
- Basic
- Admin

Restrictions:
- All body params must be of required data type(see below)
- Only admin and super admin can perform this action
- Cannot add a member that is already in the party
- User to add must exist
- Party must exist

Body params:
- user [STRING] [REQUIRED] : ID of user to add


Example request:
```javascript
request
  .post('/api/v1/party/a87e7a8c-1320-4a48-9ed7-86678d43945f/members')
  .send({
    user: 'uid', // [String, required]
  })
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
    member: {
      "id": "0b8a9a8e-821a-48a1-a789-c9fe20be9b95",
      "party_id": "1ab1891a-2349-42ca-a47a-b168df606269",
      "user_id": "9514d9cf-6719-4be5-9f29-b9618562baa7",
      "created_at": "2018-08-02T03:09:04.323Z",
      "updated_at": "2018-08-02T03:09:04.323Z"
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

#### Remove a member

[DELETE] `/party/:party_id/members`

Authorization:
- Basic
- Admin

Restrictions:
- All body params must be of required data type(see below)
- Only admin and super admin can perform this action
- Cannot remove a member that is not in the party
- User to remove must exist
- Party must exist

Body params:
- user [STRING] [REQUIRED] : ID of user to remove


Example request:
```javascript
request
  .delete('/api/v1/party/a87e7a8c-1320-4a48-9ed7-86678d43945f/members')
  .send({
    user: 'uid', // [String, required]
  })
  .end((err, res) => {
    console.log(res.body)
  })
```

Example success response:
```json
{}
```

Example error response:
```json
{
    "status": {
        "code": 404, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

---

#### Get all parties
[GET] `/parties`

Authorization:
- Basic

Restrictions:
- Must be logged in

Example request:
```javascript
request
  .get('/api/v1/parties')
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
      "parties": [
        {
          "id": "3d344190-1692-4b85-b1cd-86d4ab367900",
          "name": "WEE",
          "bio": "xxxy",
          "avatar": "WEE.jpeg",
          "created_by": "2b5740d8-7420-4365-88cb-9a9ee162e667",
          "created_at": "2018-08-02T03:54:51.268Z",
          "updated_at": "2018-08-02T03:54:51.268Z",
          "manifesto": null,
          "slogan": null,
          "motto": null,
          "about": null,
          "followers": [],
          "members": [
            "1bdc8a08-9a48-4a44-936f-5a02d270777e"
          ]
        },
        ...
      ]
    }
  }
```

Example error response:
```json
{
    "status": {
        "code": 404, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

---

#### Get one party
[GET] `/party/:party_id`

Authorization:
- Basic

Restrictions:
- Must be logged in
- Party ID must exist


Example request:
```javascript
request
  .get('/api/v1/party/9c41a6e1-1d93-4b39-86ab-ad09c859fc42')
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
      "party": {
        "id": "9c41a6e1-1d93-4b39-86ab-ad09c859fc42",
        "name": "WEE",
        "bio": "xxxy",
        "avatar": "WEE.jpeg",
        "created_by": "979d4680-ac89-4ebf-9535-b29978f62d77",
        "created_at": "2018-08-02T04:44:32.954Z",
        "updated_at": "2018-08-02T04:44:32.954Z",
        "manifesto": null,
        "slogan": null,
        "motto": null,
        "about": null,
        "followers": [],
        "members": [
          {
            "id": "e05771da-635a-4b83-b338-4af3dda75a4c",
            "firstName": "Jeromy",
            "lastName": "Glover",
            "avatar": null
          }
        ]
      }
    }
  }
```

Example error response:
```json
{
    "status": {
        "code": 404, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

---

#### Delete a party
[DELETE] `/party/:party_id`

Authorization:
- Basic
- Admin

Restrictions:
- Only admin and super admin can perform this action
- Cannot delete a party that does not exist


Example request:
```javascript
request
  .delete('/api/v1/party/9c41a6e1-1d93-4b39-86ab-ad09c859fc42')
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
    "data": {}
  }
```

Example error response:
```json
{
    "status": {
        "code": 404, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

---

#### Update a party
[PUT] `/party/:party_id`

Authorization:
- Basic
- Admin

Restrictions:
- All body params must be of required data type(see below)
- Only admin and super admin can perform this action
- Cannot update to a name that already exists
- avatar must be a valid url and format [jpeg, png, jpg]

Body params:
- name [STRING] : name of party
- bio [STRING] : bio of party
- avatar [STRING] : image url of party
- manifesto [STRING] : manifesto of party
- motto [STRING] : motto of party
- slogan [STRING] : slogan of party
- about [STRING] : about the party

Example request:
```javascript
request
  .put('/api/v1/party/9c41a6e1-1d93-4b39-86ab-ad09c859fc42')
  .send({
    name: 'MatchboX Twenty',
    slogan: 'By Order of the Peaky Blinders'
  })
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
      "party": {
        "id": "b96a6f38-e5ad-4b5b-b1d6-7d1a6446d14d",
        "name": "MatchboX Twenty",
        "bio": "xxxy",
        "avatar": "WEE.jpeg",
        "created_by": "af17ecd9-11a7-4ff5-a395-d2680fbbb18a",
        "created_at": "2018-08-02T04:58:42.158Z",
        "updated_at": "2018-08-02T04:58:42.158Z",
        "manifesto": null,
        "slogan": "By Order of the Peaky Blinders",
        "motto": null,
        "about": null
      }
    }
  }
```

Example error response:
```json
{
    "status": {
        "code": 404, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

---

#### Follow a party
[POST] `/party/:party_id/follow`

Authorization:
- Basic

Body params:
- N/A

Restrictions:
- Party with ID must exist
- User must be looged in
- Cannot follow a party that has been followed

Example request:
```javascript
request
  .post('/api/v1/party/9c41a6e1-1d93-4b39-86ab-ad09c859fc42/follow')
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
      "message": "followed party"
    }
  }
```

Example error response:
```json
{
    "status": {
        "code": 404, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

#### Unfollow a party
[DELETE] `/party/:party_id/unfollow`

Authorization:
- Basic

Body params:
- N/A

Restrictions:
- Party with ID must exist
- User must be looged in
- Cannot unfollow a party that is not followed

Example request:
```javascript
request
  .delete('/api/v1/party/9c41a6e1-1d93-4b39-86ab-ad09c859fc42/unfollow')
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
      "message": "Successfully unfollowed party"
    }
  }
```

Example error response:
```json
{
    "status": {
        "code": 404, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```
