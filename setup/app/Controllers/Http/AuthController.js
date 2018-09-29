'use strict'
const Hash = use('Hash')
const User = use('App/Models/User')
const { validate } = use('Validator')

class AuthController {
	async register ({request, response}) {
		console.log('registration control...')
	    const rules = {
	      username: 'required|unique:user,username',
	      email: 'required|email|unique:user,email',
	      password: 'required',
	      confirmPassword: 'required'
	    }

		const validation = await validate(request.all(), rules)
		if (validation.fails()) {
			// session
			// 	.withErrors(validation.messages())
			// 	.flashExcept(['password'])
			response.json({error: 'Failed Validation', messages: validation.messages()})
		} else {
			const user = new User()
	        const password = request.input('password') || ''
	        const confirmPassword = request.input('confirmPassword')

	        user.username = request.input('username')
	        user.email = request.input('email')
	        user.id = null
	        user.password = password	        

	        if (password && password === confirmPassword) {
		        var verified = await user.save()   

		        if (verified) {
		        	console.log('saving new user: ' + user.username)
		        	user.save()
			        var msg = {
		    	        success: 'Registration Successful! Now go ahead and login'
		        	}
		        	response.json({success: 'Registration Successful! Now go ahead and login'})
		        } else {
		        	response.json({error: 'Failed to save user'})
		        }
		    } else {
		    	response.json({error: 'password did not match confirmation password...'})
		    }
	    }
	}

	async login ({auth, request, response}) {
		const {email, password} = request.all()
	    const rules = {
	      email: 'required|email',
	      password: 'required'
	    }

		console.log('attempt login for ' + email)
		const validation = await validate(request.all(), rules)
		if (validation.fails()) {
			console.log('failed validation')
			response.json({error: 'Failed Login Validation', messages: validation.messages()})
		} else {
			console.log('auth attempt completed...')
			var user = await auth.attempt(email, password)
			console.log(JSON.stringify(user))
			response.json(user)
		}
	}

	async logout ({auth, request, response}) {
		var logout = await auth.logout()
		console.log('logged out...')
		response.json(logout)
	}
}

module.exports = AuthController
