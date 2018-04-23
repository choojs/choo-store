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

- `namespace` to keep your state clean
- `initialState` to make resetting easy
- `events` for all your events
- `reset` event included by default
- `render` is a default option for all events
- event names made available in `state.events`

## Install

```
npm install choo-store
```

## Usage

```js
var createStore = require('choo-store')

var store = createStore({
  namespace: 'clicks',
  initialState: { count: 0 },
  events: {
    increment: (opts, store, emitter, state) => {
      store.count++
    }
  }
})

app.use(store)
```

See [`example.js`](./example.js) for a full example.

## API

### `createStore({ namespace: string, initialState: object, events: object })`

Params:

- `namespace`: Name of store. Used for namespacing in state object and prefixing of event names.
- `initialState`: Initial state of store.
  - This will be the state of the store on initialization of the app.
  - When calling the `reset` event, state will be returned to this value.
- `events`: List of events with corresponding functions.

All params are required.

Returns a regular store function (`function (state, emitter)`) to be supplied to Choo's `app.use()` function.

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
