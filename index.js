const Enquirer = require('enquirer');
const Confirm = require('prompt-confirm');
const Password = require('prompt-password');

const enquirer = new Enquirer();

enquirer.register('confirm', Confirm);
enquirer.register('password', Password);

exports.input = exports.prompt = (message, def) => enquirer.prompt({
  name: 'input',
  message,
  default: def,
}).then(({ input }) => input);

exports.confirm = (message, def) => enquirer.prompt({
  name: 'confirm',
  type: 'confirm',
  default: def || false,
  message,
}).then(({ confirm }) => confirm);

exports.password = (message, def) => enquirer.prompt({
  name: 'password',
  type: 'password',
  message,
}).then(({ password }) => password);
