
import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'
import { states, countries, localGovernments } from 'lib/databank'

function getCountry (country) {
  return Object
    .keys(countries)
    .filter(c => c.toLowerCase() === country.toLowerCase())[0]
}

function getState (state) {
  return Object
    .keys(states)
    .filter(s => s.toLowerCase() === state.toLowerCase())[0]
}

function getLocalGovernment (lg) {
  return localGovernments
    .filter(l => l.toLowerCase() === lg.toLowerCase())[0]
}

function getLevel (level) {
  return ['federal', 'state', 'local'].includes(level)
}

function checkBody (req, res, callback) {
  const data = {}
  return check(req.body, {
    name: {
      type: 'string',
      required: true
    },
    state: {
      type: 'string'
    },
    localGovernment: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    level: {
      type: 'string'
    }
  }, (err, body) => {
    if (err) {
      return callback({ message: `Question ${err}`, code: 400 }) // eslint-disable-line
    }
    data.auth = req.auth
    data.fields = body
    return callback(null, data, res)
  })
}

function validateName (data, res, callback) {
  if (data.fields.name.length > 255) {
    return callback({ message: 'Poll name cannot be more than 255 characters long', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function validateCountry (data, res, callback) {
  if (data.fields.country) {
    const country = getCountry(data.fields.country)
    if (!country) {
      return callback({ message: 'Country is not yet supported', code: 400 }) // eslint-disable-line
    }
    data.fields.country = country
  }
  return callback(null, data, res)
}

function validateState (data, res, callback) {
  if (data.fields.state) {
    const state = getState(data.fields.state)
    if (!state) {
      return callback({ message: 'State is not yet supported', code: 400 }) // eslint-disable-line
    }
    data.fields.state = state
  }
  return callback(null, data, res)
}

function validateLocalGovernment (data, res, callback) {
  if (data.fields.localGovernment) {
    const lg = getLocalGovernment(data.fields.localGovernment)
    if (!lg) {
      return callback({ message: 'Local government is not yet supported', code: 400 }) // eslint-disable-line
    }
    data.fields.localGovernment = lg
  }
  return callback(null, data, res)
}

function validateLevel (data, res, callback) {
  if (data.fields.level && !getLevel(data.fields.level)) {
    return callback({ message: 'Level is not yet supported', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function createPoll (data, res, callback) {
  const poll = data.fields
  if (data.fields.localGovernment) {
    poll.local_government = data.fields.localGovernment
    delete poll.localGovernment
  }
  data.poll = poll
  return callback(null, data, res)
}

function savePoll (data, res, callback) {
  return knex('poll')
    .insert(data.poll)
    .returning('*')
    .then(result => {
      data.poll = result[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 201, poll: data.poll })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateName,
    validateCountry,
    validateState,
    validateLocalGovernment,
    validateLevel,
    createPoll,
    savePoll,
    fmtResult
  ])
}
