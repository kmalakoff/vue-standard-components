'use strict'
const Hash = use('Hash')
const User = use('App/Models/User')
const { validate } = use('Validator')

class AuthController {
	async register ({request, response}) {
		const {username, email, password, confirmPassword} = request.all()
	    const rules = {
	      username: 'required|unique:user,username',
	      email: 'required|email|unique:user,email',
	      password: 'required',
	      confirmPassword: 'required'
	    }
	    console.log(JSON.stringify(request.all()))
		console.log('attempt registration for ' + username + ' : ' + email)
		const validation = await validate(request.all(), rules)
		if (validation.fails()) {
			// session
			// 	.withErrors(validation.messages())
			// 	.flashExcept(['password'])
			console.log('Errors: ' + JSON.stringify(validation.messages()))
	        var msg = {
    	        errors: 'Failed validation'
        	}
			response.json(msg)
		} else {
			var user = new User()
	        user.username = username
	        user.email = email
	        user.password = password
			console.log(JSON.stringify(user))
	        
	        if (password && password.length && password === confirmPassword) {
	        	user.save()
		        var msg = {
    		        success: 'Registration Successful! Now go ahead and login',
    		        user: {email: email, username: username, userid: user.id}
        		}
        		response.json(msg)
	    	} else {
		        var msg = {
    		        errors: 'Inconsistent passwords'
        		}
        		response.json(msg)
	    	}
	    }
	}

	async login ({auth, request, response}) {
		const {email, password} = request.all()
		console.log('Attempt login for ' + email)

	    const rules = {
	      email: 'required|email',
	      password: 'required'
	    }
	    console.log('Validate: ' + JSON.stringify(rules))
		const validation = await validate(request.all(), rules)

		try {
  			var logged_in = await auth.check()
  			console.log("logged in? " + JSON.stringify(logged_in))
  			await auth.logout()
		} catch (error) {
		  response.send('Missing or invalid jwt token')
		}

		console.log('continue..')
		if (validation.fails()) {
			// session
			// 	.withErrors(validation.messages())
			// 	.flashExcept(['password'])
			console.log('Errors: ' + JSON.stringify(validation.messages()))
	        var msg = {
    	        errors: 'Failed validation'
        	}
			response.json(msg)
		} else {
	    	console.log('Validate: ' + email + ' : ' + password)
			
			try {
				const user = await auth.attempt(email, password)
				console.log('user: ' + JSON.stringify(user))
				if (user && user.id) {
					delete user.password
					response.json({success: 'Logged in successfully', user: user})				
				} else {
					response.json({errors: 'Login Failed'})
				}
			} catch (err) {
				console.log('error logging in')
				response.json({errors: 'Login Error'})				
			}
		}
	}
}

module.exports = AuthController
