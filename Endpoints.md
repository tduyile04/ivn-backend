## API endpoints

### Version 1.0
BASE URL `/api/v1`

#### User

##### Create user
[POST] `/users`

Authorization: `N/A`

Example request:
```javascript
request
  .post('/api/v1/users')
  .send({
    email: 'caroline.james@gmail.com', // [String, required]
    firstName: 'Caroline', // [String, required]
    lastName: 'James', // [String, required]
    gender: 'female', // One of 'male', 'female', 'non-binary', 'other' [required]
    country: 'Nigeria', // [String, required]
    password: 'aheartsoyoung', // [String, required], not less than 8 chars
    dateOfBirth: '1992-10-10T05:23:12.845Z', // [String, required] must be a valid date
    state: 'Lagos', // [String, required]
    phoneNumber: '+2349202848', // [String]
    is_social: false, // [Boolean] if using social authentication, set to true
    social_provider: null // one of 'google' of 'facebook' or null if using social authentication
  })
  .end((err, res) => {
    console.log(res.body)
  })
```
Example response:
```json
{
    "status": {
        "code": 201,
        "message": "success"
    },
    "data": {
        "user": {
            "id": "e90245df-c224-4af6-842f-2262b2080915",
            "email": "caroline.james@gmail.com",
            "firstName": "Caroline",
            "lastName": "James",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiZTkwMjQ1ZGYtYzIyNC00YWY2LTg0MmYtMjI2MmIyMDgwOTE1In0sImlhdCI6MTUzMjkzNTIwOSwiZXhwIjoxNTMzMDE4MDA5fQ.Sdalc0aLrVf7o6BPvx-zqTrGct7E-yGGOhpbSvETw1s"
        }
    }
}
```



##### Login user
[POST] `/users/login`

Authorization: `N/A`

Example request:
```javascript
request
  .post('/api/v1/users/login')
  .send({
    email: 'caroline.james@gmail.com', // [String, required]
    password: 'aheartsoyoung', // [String, required], not less than 8 chars
  })
  .end((err, res) => {
    console.log(res.body)
  })
```
Example response:
```json
{
    "status": {
        "code": 200,
        "message": "success"
    },
    "data": {
        "user": {
            "id": "e90245df-c224-4af6-842f-2262b2080915",
            "email": "caroline.james@gmail.com",
            "firstName": "Caroline",
            "lastName": "James",
            "avatar": null,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZTkwMjQ1ZGYtYzIyNC00YWY2LTg0MmYtMjI2MmIyMDgwOTE1IiwiaWF0IjoxNTMyOTM1MjcyLCJleHAiOjE1MzMwMTgwNzJ9.CoGBbsJfqDuT8nXojTQYXUvy6OIfqBzItd1hEuLbcOc"
        }
    }
}
```
