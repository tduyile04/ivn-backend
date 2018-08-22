# API endpoints

## Version 1.0
BASE URL `/api/v1`

### Post

#### Create Post
[POST] `/posts`

Authorization:
- Basic

Restrictions:
- Content must be strings
- Content cannot be more than 255 characters long

Body params:
- content [STRING] [REQUIRED] : Content of the post


Example request:
```js
request
  .post('/api/v1/posts')
  .send({
    content: 'Travel the world and see everything possible',
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
    "post": {
      "id": "7f0e5373-e960-4044-81e7-c74f9202c17d",
      "content": "Travel the world and see everything possible",
      "author_id": "9df41643-7a4a-4bcb-905d-2296dd7c32d1"
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

#### Comment on a post

[POST] `/post/:post_id/comment`

Authorization:
- Basic

Restrictions:
- All body params must be of required data type(see below)
- Comment cannot be more than 255 chars long
- Post must exist

Body params:
- comment [STRING] [REQUIRED] : comment to add to post

Example request:
```javascript
request
  .post('/api/v1/post/098180af-c878-4d07-887b-e4637fbd5a6f/comment')
  .send({
    comment: 'Yes please :)', // [String, required]
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
    "comment": {
      "id": "02c71a52-4456-45a8-b941-10dd3cfcc954",
      "comment": "Yes please :)",
      "user_id": "9df41643-7a4a-4bcb-905d-2296dd7c32d1",
      "post_id": "098180af-c878-4d07-887b-e4637fbd5a6f",
      "created_at": "2018-08-11T01:39:09.511Z",
      "updated_at": "2018-08-11T01:39:09.511Z"
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

#### Remove Comment on a post

[POST] `/post/:post_id/comment`

Authorization:
- Basic

Restrictions:
- All body params must be of required data type(see below)
- Post must exist
- Comment must exist
- Auth user most be the comment's author

Body params:
- comment [STRING] [UUID] [REQUIRED] : comment to remove

Example request:
```javascript
request
  .post('/api/v1/post/098180af-c878-4d07-887b-e4637fbd5a6f/remove_comment')
  .send({
    comment: '098180af-c878-4d07-887b-e4637fbd5a6f', // [String, required]
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
        "code": 400, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

---

#### Get all posts
[GET] `/posts`

Authorization:
- Basic

Restrictions:
- Must be logged in

Example request:
```javascript
request
  .get('/api/v1/posts')
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
    "posts": [
      {
        "id": "635c0b87-e509-49f1-bbff-77bc1dce26ed",
        "created_at": "2018-08-11T02:11:36.757Z",
        "author": {
          "id": "106339b3-0a96-4a88-b333-b358401942b7",
          "avatar": null,
          "lastName": "Little",
          "firstName": "Merl"
        },
        "comments": [
          {
            "id": "698d71b0-7265-45db-aacd-58255c9e4c26",
            "comment": "Travel travel travel",
            "user": {
              "id": "4c024420-f093-42de-832f-3895c69d090d",
              "avatar": null,
              "lastName": "Reichert",
              "firstName": "Nico"
            },
            "createdAt": "2018-08-11T02:11:36.770Z"
          },
          {
            "id": "4faa9975-c1a8-4b77-857c-7631cae4d33c",
            "comment": "Yes please :)",
            "user": {
              "id": "4c024420-f093-42de-832f-3895c69d090d",
              "avatar": null,
              "lastName": "Reichert",
              "firstName": "Nico"
            },
            "createdAt": "2018-08-11T02:11:36.763Z"
          }
        ],
        "likes": []
      }
      ...
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
        "code": 404, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

---

#### Get one Post
[GET] `/post/:post_id`

Authorization:
- Basic

Restrictions:
- Must be logged in
- Post ID must exist


Example request:
```javascript
request
  .get('/api/v1/post/9c41a6e1-1d93-4b39-86ab-ad09c859fc42')
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
      "post": {
        "id": "635c0b87-e509-49f1-bbff-77bc1dce26ed",
        "created_at": "2018-08-11T02:11:36.757Z",
        "author": {
          "id": "106339b3-0a96-4a88-b333-b358401942b7",
          "avatar": null,
          "lastName": "Little",
          "firstName": "Merl"
        },
        "comments": [
          {
            "id": "698d71b0-7265-45db-aacd-58255c9e4c26",
            "comment": "Travel travel travel",
            "user": {
              "id": "4c024420-f093-42de-832f-3895c69d090d",
              "avatar": null,
              "lastName": "Reichert",
              "firstName": "Nico"
            },
            "createdAt": "2018-08-11T02:11:36.770Z"
          },
          {
            "id": "4faa9975-c1a8-4b77-857c-7631cae4d33c",
            "comment": "Yes please :)",
            "user": {
              "id": "4c024420-f093-42de-832f-3895c69d090d",
              "avatar": null,
              "lastName": "Reichert",
              "firstName": "Nico"
            },
            "createdAt": "2018-08-11T02:11:36.763Z"
          }
        ],
        "likes": []
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

#### Delete a post
[DELETE] `/post/:post_id`

Authorization:
- Basic

Restrictions:
- Only post owner can perform this action
- Cannot delete a post that does not exist


Example request:
```javascript
request
  .delete('/api/v1/post/9c41a6e1-1d93-4b39-86ab-ad09c859fc42')
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

#### Like and unlike a post

[POST] `/post/:post_id/like`

Authorization:
- Basic

Restrictions:
- All body params must be of required data type(see below)
- Post must exist
- Must be logged in
- If user already liked post, hitting this point again will dislike post

Body params:
N/A

Example request:
```javascript
request
  .put('/api/v1/post/098180af-c878-4d07-887b-e4637fbd5a6f/like')
  .send({})
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
        "code": 400, // one of 400, 403 etc...
        "message": "failed"
    },
    "error": {
        "message": "..."
    }
}
```

---