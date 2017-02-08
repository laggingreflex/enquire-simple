# enquire-simple

Simle wrapper for [Enquirer]

For when all you need is a simple input/confirm prompt.

## Install

```
npm i enquire-simple
```

## Usage

```
import {prompt, confirm, password} from 'enquire-simple';

(async(){
  const input = await prompt('Please enter a value:', 5);
  // => Please enter a value [5]: _
  console.log(input)
  // => 5
})()
```

[enquirer]: https://github.com/enquirer/enquirer
