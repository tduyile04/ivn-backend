# API endpoints

## Version 1.0
BASE URL `/api/v1`

### Upload

#### Upload a file
[POST] `/uploads`

Authorization:
- Basic

Restrictions:
- All body params must be of required data type(see below)
- Must be logged in

Body params:
- filename [STRING] : name of the file
- filetype [STRING] : type of file. Must be one of [image or pdf]
- comment [STRING] : just a comment on the file
- file [FILE] : File to upload

Example request:
```js
request
  .post('/api/v1/uploads')
  .send({ file: <Insert File here> }) # multipart/form-data
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
        "image_url": "https://res.cloudinary.com/said-death-to-passion/raw/upload/v1533194831/ju6fliqs84gv467svshg"
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
