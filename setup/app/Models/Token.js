'use strict'

const Model = use('Model')

class Token extends Model {
  static get table () {
    return 'token'
  }
}

module.exports = Token
