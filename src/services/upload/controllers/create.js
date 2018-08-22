import check from 'body-checker'
import cloudinary from 'cloudinary'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

function checkBody (req, res, callback) {
  const data = {}
  return check(
    req.body,
    {
      filename: { type: 'string' },
      filetype: { type: 'string' },
      comment: { type: 'string' }
    }, (err, body) => {
    if (err) return callback({ message: `Upload ${err}`, code: 400 }) // eslint-disable-line
      data.fields = body
      data.auth = req.auth
      data.file = req.file
      return callback(null, data, res)
    })
}

function validateDataType (data, res, callback) {
  const mimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4']
  if (!mimeTypes.includes(data.file.mimetype)) {
    return callback({ message: 'File type is not accepted', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function uploadCloudinary (data, res, callback) {
  cloudinary.v2.uploader.upload_stream(
    { resource_type: 'raw' },
    (error, result) => {
      if (error) {
        return errorHandler(error, res)
      }
      data.result = result
      return callback(null, data, res)
    })
    .end(data.file.buffer)
}

function saveResponse (data, res, callback) {
  const value = Object.assign({}, data.fields, { url: data.result.secure_url, user_id: data.auth.id })
  console.log(data.auth)
  return knex('upload')
    .insert(value)
    .then(() => callback(null, data, res))
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 201, image_url: data.result.secure_url })
}

function undoFromCloudinary () {} // eslint-disable-line

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateDataType,
    uploadCloudinary,
    saveResponse,
    fmtResult
  ])
}
