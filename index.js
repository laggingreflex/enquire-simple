const Enquirer = require('enquirer');
const enquirer = new Enquirer();
enquirer.register('string', Enquirer.StringPrompt);
enquirer.register('prompt', Enquirer.StringPrompt);
enquirer.register('number', Enquirer.NumberPrompt);
enquirer.register('boolean', Enquirer.BooleanPrompt);
enquirer.register('array', Enquirer.ArrayPrompt);

const promptableTypes = ['string', 'number', 'boolean', 'array'];

module.exports = new Proxy(base(), { get });

function base(defaultType = 'input') {
  return function EnquireSimple(opts, initial) {
    if (!opts) opts = {};
    if (typeof opts === 'string') opts = { message: opts };
    opts = { ...opts };
    let processChoice;
    [opts.choices, processChoice] = processChoices(opts.choices);
    opts.initial = or(initial, opts.default, opts.initial);
    opts.type = getType(opts.initial, or(opts.type, defaultType));
    if (opts.type === 'boolean') {
      opts.type = 'toggle'
    }
    if (opts.choices && !opts.type) {
      opts.type = 'select';
    }
    opts.name = 'name';

    const enquirer = new Enquirer();
    enquirer.register('string', Enquirer.StringPrompt);
    enquirer.register('boolean', Enquirer.BooleanPrompt);
    enquirer.register('array', Enquirer.ArrayPrompt);
    let prompt;
    enquirer.on('prompt', p => prompt = p);

    const promptPromise = enquirer.prompt(opts);
    const deferred = defer();

    // promptPromise.then(r => deferred.resolve(r));
    promptPromise.catch(e => {
      if (error === '') {
        /* https://github.com/enquirer/enquirer/issues/225 */
        return {};
      } else {
        throw error;
      }
    }).then(result => {
      const answer = result.name;
      if (answer === undefined && undefined !== initial) {
        return initial;
      } else if (processChoice) {
        return processChoice(answer);
      } else {
        return answer;
      }
    }).then(deferred.resolve).catch(deferred.reject);

    promptPromise.catch(e => deferred.reject(e));

    deferred.cancel = deferred.promise.cancel = () => {
      deferred.reject('');
      prompt.cancel();
    };

    deferred.enquirer = deferred.promise.enquirer = enquirer;

    return deferred.promise;
  }
}

function get(x, type) {
  return new Proxy(base(type), { get });
}

function processChoices(choices) {
  if (!choices) return [];
  if (Array.isArray(choices)) return [choices];
  const keys = Object.keys(choices);
  return [keys, async answer => {
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
  }]
}

function arrify(array) {
  return Array.isArray(array) ? array : array === undefined ? [] : [array];
}

function getType(thing, defaultType = 'string') {
  const type = Array.isArray(thing) ? 'array' : typeof thing;
  if (promptableTypes.includes(type)) return type;
  return defaultType
}

function or(...args) {
  for (const arg of args) {
    if (arg !== undefined) return arg;
  }
}

function defer() {
  const promise = {};
  promise.promise = new Promise((resolve, reject) => {
    promise.resolve = r => resolve(r);
    promise.reject = e => reject(e);
  });
  return promise;
}
