export default {
  registrationFields: [
    {name: 'username', type: 'text'},
    {name: 'email', type: 'text'},
    {name: 'password', type: 'password'},
    {name: 'confirmPassword', placeholder: 're-enter password', type: 'password'}
  ],
  loginFields: [
    {name: 'email', type: 'text', placeholder: '-- email --', prompt: 'Email Address'},
    {name: 'password', placeholder: '-- password --', type: 'password', prompt: 'Password'}
  ]
}
