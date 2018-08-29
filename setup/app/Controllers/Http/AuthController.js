'use strict'
const Hash = use('Hash')

class AuthController {
	async login ({auth, request, response}) {
		console.log('attempt to login with credentials:')
	    const {email, password} = request.all()

	    console.log(email + ' : ' + password)
	    try {
	    	var loggedIn = auth.check()
	    	console.log('logged in: ' + JSON.stringify(loggedIn))
	    	if (loggedIn) {
		    	console.log('log out first...')
		    	await auth.logout()
		    }
		    console.log('validate: ' + email + ' : ' + password)

			var user = await auth.attempt(email, password)
			console.log('user: ' + JSON.stringify(user))
			if (user) {
				user.password = null
				var payload = user
				console.log('regenerated payload: ' + JSON.stringify(payload))
				response.json(payload)
			} else {
				response.json({error: 'failed to authorize'})
			}
	    } catch (e) {
	    	response.unauthorized({error: e.message})
	    }
	}

	async loginTest ({ auth, request, response, session }) {
	    const {email, password} = request.all();

	    try {
	    	var loggedIn = auth.check()

	    	if (loggedIn) {
		    	console.log('log out first...')
		    	await auth.logout()
		    }
		    console.log('continue')

		    try {
				var token = await auth.attempt(email, password)

				if (token) {
					console.log('token: ' + JSON.stringify(token))
					var payload = { email: email, status: 'logged in', token: 'xyz'}
					console.log('regenerated payload: ' + JSON.stringify(payload))
					response.json(payload)
				} else {
					response.json({error: 'failed to authorize'})
				}
			} catch (e) {
				response.json({error: e.message})
			}
	    } catch (e) {
	    	response.unauthorized({error: e.message})
	    }
	}
}

module.exports = AuthController
