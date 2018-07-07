import all from './all'
import create from './create'

const model = 'something'

class Party {
  all = all(model)
  create = create(model)
}

export default Party
