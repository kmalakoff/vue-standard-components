'use strict'
const Hash = use('Hash')
const Database = use('Database')
const User = use('App/Models/User')
const Login = use('App/Models/Login')
const { validate } = use('Validator')
const Validator = use('Validator')

var Config = use('Config')

class AuthController {
	async register ({auth, request, response}) {
		const {username, email, password, confirmPassword} = request.all()
	    const rules = {
	      username: 'required',
	      email: 'required|email|unique:user,email',
	      password: 'required|min:6',
	      confirmPassword: 'required'
	    }
	    // Note: confirmPassword may be bypassed on client side explicitly by simply copying password input to confirmPassword prior to posting

		console.log('attempt registration for ' + email)
		const validation = await Validator.validateAll(request.all(), rules)
		if (validation.fails()) {
			var errors = validation.messages()
			console.log('Failed registration validation' + JSON.stringify(validation.messages()))
			response.json( { error: 'Failed Validation', validation_errors: errors, rules: rules} )
		} else {
			const authenticator = Config.get('auth.authenticator')
			console.log(authenticator + ' signup attempt for ' + email)
			var user = new User()
	        user.username = username
	        user.email = email
	        user.password = password
	        if (password && password.length && password === confirmPassword) {
				try {
					await user.save()

					var reloaded = await User.findBy('email', email)
					console.log('new user: ' + JSON.stringify(reloaded))

					const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
					const login = new Login()
					login.user_id = reloaded.id
					login.login = timestamp

					await login.save()

					console.log('login: ' + JSON.stringify(login))

					const payload = {
						userid: reloaded.id,
						username: reloaded.username,
						email: reloaded.email,
						role: 'user',
						access: reloaded.access,
						login_id: login.id,
						kyc_level: 0
					}

					// console.log('payload: ' + JSON.stringify(payload))
					var returnval = {
	    		        success: true,
	    		        message: 'Registration Successful',
	    		        mode: authenticator, // eg jwt or session authentication
	    		        payload: payload
	    		    }
					console.log('response: ' + JSON.stringify(returnval))

					if (authenticator === 'jwt') {
						// add token to response if jwt authentication is being used
		        		var token = await auth.generate(user)
						console.log('generated token: ' + JSON.stringify(token))
						returnval.token = token
					}
	        		response.json(returnval)
			    } catch (error) {
			        var msg = 'Failed to register'
		        	console.log('caught registration error: ' + error)
					response.json({error: msg})
				}
	    	} else {
	    		console.log('passwords did not match')
        		response.json({error: 'Password Error'})
	    	}
	    }
	}

	async login ({auth, request, response}) {
		const {email, password} = request.all()
	    const rules = {
	      email: 'required|email',
	      password: 'required'
	    }
		const validation = await Validator.validateAll(request.all(), rules)

		if (validation.fails()) {
			var fails = validation.messages()
			console.log('Failed registration validation' + JSON.stringify(fails))
			response.json( { error: 'Failed Validation', validation_errors: fails, rules: rules } )
		} else {
			console.log('got email + password ')
			const authenticator = Config.get('auth.authenticator')
			console.log(authenticator + ' login attempt for ' + email)
			try {
				// var logged_in = await auth.check()
				// console.log("logged in already ? " + JSON.stringify(logged_in))
				// await auth.logout()
				var token = null
				var payload = null

				if (authenticator === 'jwt') {
					console.log('get token...')
					const access = await auth
            			.withRefreshToken()
            			.attempt(email, password)
            		token = access.token
				}

				console.log('get authorized user...')
				const user = await Database
					.select(
						'user.id',
						'user.username',
						'user.email',
						// 'user.access',
						'agent.role',
						'user.status',
						'user.kyc_level',
						'organization.name'
					)
					.from('user')
					.leftJoin('agent', 'user_id', 'user.id')
					.leftJoin('organization', 'organization_id', 'organization.id')
					.where('user.email', 'like', email)

				console.log('USER: ' + JSON.stringify(user))
				if (user && user.length) {
					console.log('retrieved user: ' + JSON.stringify(user))
					const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

					const login = new Login()
					login.user_id = user[0].id
					login.login = timestamp
					await login.save()

					console.log(login.id + ': Logged in: ' + JSON.stringify(login))
					const payload = {
						userid: user[0].id,
						username: user[0].username,
						email: user[0].email,
						role: user[0].role,
						status: user[0].status,
						login_id: login.id,
						kyc_level: user[0].kyc_level
					}
					if (!user[0].role) { 
						console.log('default to user role')
						payload.role = 'user'
					}
					console.log('generated payload: ' + JSON.stringify(payload))

					response.json({
						success: 'Logged in successfully',
						mode: authenticator,
						payload: payload,
						token: token // null if not using jwt authentication
					})
				} else {
					console.log('user not found')
					return {error: 'Authorization Failed'}
				}					
			} catch (err) {
				console.log('error logging in: ' + err)
				return {error: 'Login Error', message: err}				
			}
		}
	}

   	async logout({request, auth}) {	
		const {login_id} = request.all()
		// var logged_in = await auth.check()
		// console.log('logged in ?' + JSON.stringify(logged_in))
   		console.log('logging out from ' + login_id)
		const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
		console.log('at: ' + timestamp)
		var update = Database
			.table('login')
			.where('id', login_id)
			.update('logout', timestamp)
 
		try {
       		const ok = await update
       		console.log(ok + ' logged out successfully: ' + timestamp)
       		return {success: 'Logged Out'}
       	} catch (err) {
       		console.log('error tracking logout: ' + err)
       		return {error: 'Logout Error'}
       	}
    }

   	async refresh({request, auth}) {
        // not implemented yet, but would be something like ...
        const refreshToken = request.input('refresh_token')
        return await auth.generateForRefreshToken(refreshToken)
    }

    async getUser({ response, auth }) {
        // not implemented yet, but would be something like ...
        try {
            const user = await auth.getUser()

            // I personally do not want to return the full user object here
            return {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }
        } catch (error) {
            response.status(401).send(error)
        }
    }

    async thirdPartyAuthentication({ request, response, auth }) {
        // not implemented yet ... 
		const {target} = request.all() // eg 'facebook'

    	await ally.driver(target).redirect()
    }

    async thirdPartyUser({ request, response, auth }) {
        // not implemented yet ... 
		const {target} = request.all() // eg 'facebook'

    	var fields = []; // may vary by target app... eg: ['username', 'email', 'profile_pic']
		await ally
			.driver(target)
			.fields(fields)
			.getUser()
    }
}

module.exports = AuthController
