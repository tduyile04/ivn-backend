import all from './all'
import one from './one'
import create from './create'
import remove from './remove'
import update from './update'
import follow from './follow'
import unfollow from './unfollow'

const model = 'something'

class Party {
  all = all(model)
  one = one(model)
  create = create(model)
  remove = remove(model)
  update = update(model)
  follow = follow(model)
  unfollow = unfollow(model)
}

export default Party
