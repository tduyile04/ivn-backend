# API endpoints

## Version 1.0
BASE URL `/api/v1`

### User

#### Get all users
[GET] `/users`

Authorization:
- Basic

Query
  - limit [Number] number of users per page
  - page [Number] data page
  - roles [string] roles of users to fetch e.g if fetching for oly candidate, roles=candidate if politician and candidate, roles=politician,candidate
  - state [String] state in which user to fetch is registered in
  - country [String] country in which user to fetch is registered in
  - localGovernment [String] local government in which user to fetch is registered in

Restrictions:
- Must be logged in

Example request:
```javascript
request
  .get('/api/v1/users/?limit=10&page=2&roles=candidate,politician&state=lagos&localgovernment=maryland&country=nigeria')
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
    "users": [
      {
        "id": "ac6db657-5657-4b0d-b1d1-d170d4fa3713",
        "email": "Julius_Balistreri71@gmail.com",
        "firstName": "Fernando",
        "lastName": "Kilback",
        "roles": [
          "politician"
        ]
      },
      {
        "id": "5c0b2a7b-6b39-47ad-ba51-1555ef61387d",
        "email": "Dorothy.Wiza@hotmail.com",
        "firstName": "Eleanora",
        "lastName": "Kreiger",
        "roles": [
          "politician"
        ]
      },
      {
        "id": "ba30eccc-d1a9-4665-9bf1-59fdef7a3919",
        "email": "Gordon.Powlowski@hotmail.com",
        "firstName": "Gudrun",
        "lastName": "Ullrich",
        "roles": [
          "candidate"
        ]
      },
      {
        "id": "7b6b0a6e-8a5e-499c-a3d9-2c22d4942dbc",
        "email": "Ludwig61@gmail.com",
        "firstName": "Helga",
        "lastName": "Cummerata",
        "roles": [
          "politician"
        ]
      }
    ]
  },
  "metadata": {
    "total": 14,
    "perPage": 10,
    "totalPage": 2,
    "page": 2
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
