# choo-store [![stability][0]][1]

[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Create a store for a [`choo`](https://github.com/choojs/choo) application.

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

- namespace with [`storeName`](https://github.com/choojs/choo#appusecallbackstate-emitter-app) to keep state clean and improve tracing
- set `initialState` to make resetting easy
- organize all your `events` to reduce boilerplate
- event names made available in `state.events.storeName`
- free `reset` event included with purchase

## Install

```
npm install choo-store
```

## Usage

```js
var createStore = require('choo-store')
var app = require('choo')()

var store = createStore({
  storeName: 'clicks',
  initialState: { count: 0 },
  events: {
    increment: ({ store, emitter }) => {
      store.count++
      emitter.emit('render')
    }
  }
})

app.use(store)
```

See [`example.js`](./example.js) for a full example.

## API

### `createStore({ storeName, initialState, events })`

Params:

- `storeName` - *string*: Name of store. Used for namespacing in state object and prefixing of event names.
- `initialState` - *object*: Initial state of store.
  - This will be the state of the store on initialization of the app.
  - When calling the `reset` event, state will be returned to this value.
- `events` - *object*: List of named event functions.

All params are required.

Returns a regular store function (`function (state, emitter, app)`) to be supplied to Choo's `app.use()` function.

Attaches event names to `state.events[storeName]` for convenience. For example, if you have a store `clicks` with an event `increment`, the event name (`clicks:increment`) will be available at `state.events.clicks.increment`.

#### Event Functions

Each event function has the following signature:

```js
function event ({ data, store, state, emitter, app }) {}
```

Params:

- `data` - *any*: Event data supplied by user.
- `store` - *object*: Local store state.
- `state` - *object*: Global app state.
- `emitter` - *[nanobus](https://github.com/choojs/nanobus)*: Choo event emitter.
- `app` - *[choo](https://github.com/choojs/choo)*: Choo instance.

Params are wrapped in a single object so that argument order is made irrelevant and users can take what they need from the event parameters object.

#### `reset` event

A `reset` event (e.g. `storeName:reset`) is added by default.

Emitting this event will reset the store's state to `initialState`.

It takes a `render` boolean option in case you want to emit a render event afterwards.

```js
emit('storeName:reset', { render: true })
```

## Why

**Q: Choo has a decent way to create a store already. Why use this?**

**A: Bigger apps need more structure!**

As an application gets larger, some issues can arise that need to be dealt with:

- properly namespacing stores and events
- resetting stores to their initial state
- avoiding direct manipulation of other stores
- providing coherent structure for a project
- reducing repetitive boilerplate

Doing the above gets time consuming the bigger an app gets. Without lots of attention to detail, it's easy to lose track of [value drift](https://universalpaperclips.gamepedia.com/Value_Drift) between stores in these cases. This module aims to make the process of managing stores and events simple and easy.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## License

[ISC](LICENSE.md)
