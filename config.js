export default {
  registrationFields: [
    {name: 'username', type: 'text'},
    {name: 'email', type: 'text'},
    {name: 'password', placeholder: 'password', type: 'password'},
    {name: 'confirmPassword', placeholder: 're-enter password', type: 'password', prompt: '(confirm)'}
  ],
  loginFields: [
    {name: 'email', type: 'text', prompt: 'Email Address'},
    {name: 'password', placeholder: 'password', type: 'password'}
  ]
}
