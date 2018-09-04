'use strict'

const Database = use('Database')
const Config = use('Config')
const Logger = use('Logger')
const Model = use('Model')
// const { validate } = use('Validator')

console.log('loaded user controller...')
Logger.warning('got warning')

class UserController {
	userProfile ({request, response}) {
		console.log('generate the user profile...')
		Logger.warning('generate user profile...')
		response.json({msg: 'generate user profile'})
	}

	* userList ({request, response}) {
		console.log('generate user list...')
		response.send('generate user lists')
	}
}

module.exports = UserController
