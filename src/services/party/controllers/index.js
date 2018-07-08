import all from './all'
import create from './create'
import remove from './remove'
import update from './update'

const model = 'something'

class Party {
  all = all(model)
  create = create(model)
  remove = remove(model)
  update = update(model)
}

export default Party
