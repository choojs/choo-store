# choo-store [![stability][0]][1]

[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Create a namespaced store for a [`choo`](https://github.com/choojs/choo) application.

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/choo-store.svg?style=flat-square
[3]: https://npmjs.org/package/choo-store
[4]: https://img.shields.io/travis/ungoldman/choo-store/master.svg?style=flat-square
[5]: https://travis-ci.org/ungoldman/choo-store
[8]: http://img.shields.io/npm/dm/choo-store.svg?style=flat-square
[9]: https://npmjs.org/package/choo-store
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard

## Features

- Conventions!
  - `namespace` to keep your state clean
  - `initialState` to make resetting easy
  - `events` for all your events
  - `reset` event included by default
  - `render` is a default option for all events

## Install

```
npm install choo-store
```

## Usage

```js
var Store = require('choo-store')
var html = require('choo/html')
var choo = require('choo')

const clickStore = new Store({
  namespace: 'clicks',
  initialState: { count: 0 },
  events: {
    increment: (opts, store, emitter, state) => {
      store.count++
    }
  }
})

var app = choo()
app.route('/', mainView)
app.use(clickStore.connect)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.clicks.count}</h1>
      <button onclick=${increment}>Increment</button>
      <button onclick=${reset}>Reset</button>
    </body>
  `

  function increment () {
    emit('clicks:increment', { render: true })
  }

  function reset () {
    emit('clicks:reset', { render: true })
  }
}
```

## Why

**Q: Choo has a decent way to create a store already. Why use this?**

**A: Bigger apps need more structure!**

As an application gets larger, some issues can arise that need to be dealt with:

- properly namespacing stores and events
- resetting stores to their initial state
- avoiding direct manipulation of other stores

Doing the above gets time consuming the bigger an app gets. A lot of boilerplate is needed, and it's easy to lose track of [value drift](https://universalpaperclips.gamepedia.com/Value_Drift) between stores in these cases. This module aims to make the process of managing multiple stores simple and easy.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## License

[ISC](LICENSE.md)
