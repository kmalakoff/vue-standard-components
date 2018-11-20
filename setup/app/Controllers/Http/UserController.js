'use strict'

const Database = use('Database')
const Config = use('Config')
const Logger = use('Logger')
const Model = use('Model')
// const { validate } = use('Validator')

console.log('loaded user controller...')
Logger.warning('got warning')

class UserController {
	async userProfile ({request, response}) {
		console.log('generate the user profile...')
		console.log('user: ' + JSON.stringify(auth.user))

		Logger.warning('generate user profile...')
		response.json({msg: 'generate user profile'})
	}

	async userList ({request, response}) {
		console.log('generate user list...')
		response.send('generate user lists')
	}
}

module.exports = UserController
