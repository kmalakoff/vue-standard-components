'use strict'
const Hash = use('Hash')
const User = use('App/Models/User')
const { validate } = use('Validator')

class RegisterController {
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
			console.log('login info verified')
			const user = new User()
	        user.username = request.input('username')
	        user.email = request.input('email')
	        user.id = null
	        
	        const password = request.input('password')
	        const confirmPassword = request.input('confirmPassword')

	        var verified = await user.encryptPassword(password, confirmPassword)    

	        if (verified) {
	        	console.log('verified')
	        	await user.save()
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
}

module.exports = RegisterController
