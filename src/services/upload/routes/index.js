import Upload from '@upload/controllers'
import composeAppRoute from 'lib/compose/app-route'
import multer from 'multer'
import allow from '_middlewares/allow'

const upload = multer({
  storage: multer.memoryStorage()
})

export const routes = composeAppRoute(
  [
    ['post', '/uploads', upload.single('file'), allow('auth'), 'create']
  ],
  new Upload()
)
