export default {
  registrationFields: [
    {name: 'username', prompt: 'Username'},
    {name: 'fullname', prompt: 'Full Name'},
    {name: 'address'},
    {name: 'postal_code', placeholder: 'postal code', prompt: 'Postal Code'},
    {name: 'birthdate', type: 'date', placeholder: ' Birthdate (yyyy-mm-dd) '},
    {name: 'email', type: 'text'},
    {name: 'password', placeholder: 'password', type: 'password'},
    {name: 'confirmPassword', placeholder: 're-enter password', type: 'password', prompt: '(confirm)'}
  ],
  loginFields: [
    {name: 'email', type: 'text'},
    {name: 'password', placeholder: 'password', type: 'password'}
  ]
}
