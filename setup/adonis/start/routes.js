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

require('./t4uRoutes')
require('./OvidRoutes')

Route.on('/').render('welcome')

Route.get('upload', 'GenericController.upload')
Route.post('upload', 'GenericController.upload')

Route.get('search', async ( {request} ) => {
	// requires configuration of searchable tables in database.custom 
	Logger.debug('custom: ' + JSON.stringify(customConfig))

	const input = request.get()
	Logger.debug('input: ' + JSON.stringify(input))
	const searchConfig = customConfig.search || {}
	Logger.debug('search: ' + JSON.stringify(searchConfig))

	const table = input.table || ''

	if (!table) { 
		var available = Object.keys(searchConfig)
		return { error: 'no table supplied', message: 'Defined table options: ' + available.join(', ') }
	}

	const thisConfig = searchConfig[table]
	const DBtable = thisConfig.table || table || ''

	var fields = input.fields || thisConfig.fields || []
	var groupBy = input.groupBy || thisConfig.groupBy
	var condition = input.condition || thisConfig.condition
	var rawFields = input.rawFields || thisConfig.rawFields

	if (fields.constructor === String) {
		fields = fields.split(/\s*,\s*/)
	}
	var joins = thisConfig.joins
	Logger.debug('join: ' + JSON.stringify(joins))

	var result = Database
		.select(fields)
		.from(DBtable)

	for (var i = 0; i < joins.length; i++) {
		var join = joins[i]
		result.innerJoin(join[0], join[1], join[2])
	}

	if (rawFields) {
		result.select(Database.raw(rawFields))
	}

	if (groupBy) {
		result.count('disease_id as count')
		result.groupBy(groupBy)
	}

	if (condition) {
		result.whereRaw(condition)
	}

	Logger.debug('SQL: ' + result.toSQL().sql)
	return await result
})


Route.any('*', ({response}) => response.download(Helpers.publicPath('mainVue.html')))
