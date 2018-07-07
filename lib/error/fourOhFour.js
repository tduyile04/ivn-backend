import response from 'lib/compose/response'

export default (req, res) => {
  return response(res)
    .error(
      404,
      { message: 'resource not found' }
    )
}
