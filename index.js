const Enquirer = require('enquirer');
const enquirer = new Enquirer();
enquirer.register('string', Enquirer.StringPrompt);
enquirer.register('boolean', Enquirer.BooleanPrompt);
enquirer.register('array', Enquirer.ArrayPrompt);

module.exports = new Proxy(base(), { get });

function base(type = 'input') {
  return async function EnquireSimple(opts, defaultValue) {
    if (typeof opts === 'string') opts = { message: opts };
    const processChoice = processChoices(opts);
    let answer;
    try {
      const { name } = await enquirer.prompt({
        type,
        initial: defaultValue,
        ...opts,
        name: 'name',
      });
      answer = name;
    } catch (error) {
      if (error !== '') {
        /* https://github.com/enquirer/enquirer/issues/225 */
        throw error;
      }
    }
    if (answer === undefined && undefined !== defaultValue) {
      return defaultValue;
    } else if (processChoice) {
      return processChoice(answer);
    } else {
      return answer;
    }
  }
}

function get(x, type) {
  return new Proxy(base(type), { get });
}

function processChoices(opts) {
  const { choices } = opts;
  if (!choices) return;
  if (Array.isArray(choices)) return;
  const keys = Object.keys(choices);
  opts.choices = keys;
  return async answer => {
    const result = {};
    for (const key of arrify(answer)) {
      if (!(key in choices)) return;
      const fn = choices[key].execute || choices[key];
      if (typeof fn === 'function') {
        result[key] = await choices[key]();
      } else {
        result[key] = true;
      }
    }
    if (typeof answer === 'string') {
      return result[answer];
    } else {
      return result;
    }
  }
}

function arrify(array) {
  return Array.isArray(array) ? array : array === undefined ? [] : [array];
}
