# enquire-simple

Simpler API for [Enquirer]

## Install

```
npm i enquire-simple
```

## Usage

```
const { prompt, confirm, password } = reqire('enquire-simple');

const input = await prompt('Please enter a value:', 5);
// => Please enter a value [5]: _

console.log(input)
// => 5
```

[enquirer]: https://github.com/enquirer/enquirer
