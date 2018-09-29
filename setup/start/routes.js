'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')
const Helpers = use('Helpers')
const Logger = use('Logger')
const Config = use('Config')
const Database = use('Database')

const customConfig = Config.get('custom.database')

// require('./ABCDRoutes') // Substitute custom routes here (replace 'ABCD' with your route names)

require('./sparc/sparcRoutes')
// require('./searchRoutes')

Route.on('/').render('welcome')

Route.get('upload', 'GenericController.upload')
Route.post('upload', 'GenericController.upload')

Route.get('/user', 'UserController.userProfile')
Route.get('/users', 'UserController.userList')

Route.get('/login', 'AuthController.login')
Route.post('login', 'AuthController.login')

Route.get('/logout', 'AuthController.logout')
Route.post('logout', 'AuthController.logout')

Route.get('/register', 'AuthController.register')
Route.post('register', 'AuthController.register')

Logger.warning('config: ' + JSON.stringify(customConfig))
console.log('Config: ' + JSON.stringify(customConfig))

Route.any('*', ({response}) => response.download(Helpers.publicPath('mainVue.html')))
