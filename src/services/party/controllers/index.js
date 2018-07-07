import all from './all'
import create from './create'
import remove from './remove'

const model = 'something'

class Party {
  all = all(model)
  create = create(model)
  remove = remove(model)
}

export default Party
