'use strict'

const Env = use('Env')
const Helpers = use('Helpers')
const Config = use('Config')

module.exports = {
  database: {
    upload: {
      // specify explicit list of tables that can be updated, along with default field validation requirements  (for security)
      // keys = table name (lower case);  values = validation ( eg { name: 'required|min:3|max:10'} )
      'teas' : { name: 'required|min:3|max:5' },
      'vaccine' : { name: 'required' },
      'disease' : { name: 'required' },
    },

    search: {
      // specify explicit list of tables that can be searched, along with default fields accessible  (for security)
      // keys = table name (lower case);  values = hash of options (fields: array, joins, array of arrays)
      'teas' : {
        fields: [
          'teas.id',
          'teas.name',
          'teas.description',
          'teas.price', 
          'tea_varieties.name as variety', 
          'tea_types.name as type'
        ],
        joins: [
          ['tea_varieties', 'teas.variety', 'tea_varieties.id'],
          ['tea_types', 'teas.type', 'tea_types.id']
        ]
      },
      'disease' : {
        fields: [
          'disease.name',
          'disease.description',
        ],
        joins: [
        ]
      },
      'vaccine' : {
        fields: [
          'vaccine.name',
          'vaccine.description',
        ],
        joins: [
        ]
      },
      'immunization' : {
        table: 'vaccine',
        fields: [
          'vaccine.id as vaccine_id',
          'vaccine.name as vaccine',
          'vaccine.description',
          'vaccine.code',
          'disease.id as disease_id',
        ],
        rawFields: [
          'group_concat(disease.name) as coverage',
          'group_concat(disease.id) as disease_ids'
        ],
        joins: [
          ['disease_vaccine', 'vaccine.id', 'disease_vaccine.vaccine_id'],       
          ['disease', 'disease_vaccine.disease_id', 'disease.id']
        ],
        groupBy: ['vaccine_id']
      },
    }
  }
}
