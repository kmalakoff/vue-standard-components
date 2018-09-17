'use strict'
const Hash = use('Hash')
const User = use('App/Models/User')
const { validate } = use('Validator')

class AuthController {
	async register ({request, response}) {
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
			console.log('Errors: ' + JSON.stringify(validation.messages()))
	        var msg = {
    	        errors: 'Failed validation'
        	}
			response.json(msg)
		} else {
			const user = new User()

	        user.username = request.input('username')
	        user.email = request.input('email')
	        user.id = null
	        
	        const password = request.input('password')
	        const confirmPassword = request.input('confirmPassword')

	        var verified = await user.encryptPassword(password, confirmPassword)    

	        if (verified) {
	        	console.log('saving new user: ' + user.username)
	        	user.save()
		        var msg = {
	    	        success: 'Registration Successful! Now go ahead and login'
	        	}
	        	response.json(msg)
	        } else {
	        	console.log('failed to verify: ' + verified)
		        var msg = {
	    	        error: 'Validation Failed'
	        	}
	        	response.json(msg)
	        }
	    }
	}

	async login ({auth, request, response}) {
		const {email, password} = request.all()
	    const rules = {
	      email: 'required|email|unique:user,email',
	      password: 'required'
	    }

		console.log('attempt login for ' + email)
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
	    	console.log('validate: ' + email + ' : ' + password)

			var user = await auth.attempt(email, password)
			console.log('user: ' + JSON.stringify(user))
			response.json(user)
			// if (user) {
			// 	user.password = null
			// 	var payload = user
			// 	console.log('regenerated payload: ' + JSON.stringify(payload))
			// 	response.json(payload)
			// } else {
	  		//    console.log('failed to verify')
		 	//        var msg = {
	  		//   	        error: 'Login Failed'
	  		//       	}
	  		//       	response.json(msg)
			// }
		}
	}
}

module.exports = AuthController
