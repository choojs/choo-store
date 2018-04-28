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

- **namespacing**: use [`storeName`](https://github.com/choojs/choo#appusecallbackstate-emitter-app) to keep state clean and improve tracing
- **scoped state**: set `initialState` to make initializing and resetting easy
- **simplified events API**: organize all your `events` to reduce boilerplate
- **action functions**: automagically creates action functions that accept data and emit events
- **event names in state**: event names made available in `state.events.storeName`
- **free reset event**: free `reset` event included with purchase

## Install

```
npm install choo-store
```

## Usage

First, set up your store's name, initial state, and events:

```js
var createStore = require('choo-store')

module.exports = createStore({
  storeName: 'clicks',
  initialState: { count: 0 },
  events: {
    increment: ({ store, emitter }) => {
      store.count++
      emitter.emit('render')
    }
  }
})
```

Next, register your store with your choo app:

```js
var app = require('choo')()
var store = require('./stores/clicks')

app.use(store)
```

Now you can use store state and actions in your component:

```js
var html = require('choo/html')
var { actions } = require('./stores/clicks')

module.exports = (state, emit) => {
  return html`
    <body>
      <h1>count is ${state.clicks.count}</h1>
      <button onclick=${e => actions.increment(1)}>Increment</button>
      <button onclick=${e => actions.reset({ render: true })}>Reset</button>
    </body>
  `
}
```

### Example

See the [`example`](./example) folder for a full working example.

You can also check it out locally by cloning this repo and running `npm i && npm run example`.

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

Returned function also has an `actions` property containing ready-to-go named functions that take whatever data you pass and emit the right event.

Once a store has been created, these three methods of emitting an event all do the same thing:

```js
store.actions.increment(1)
emit(state.events.clicks.increment, 1)
emit('clicks:increment', 1)
```

### Event Functions

Event functions live in the `events` object and have the following signature:

```js
function eventName ({ data, store, state, emitter, app }) {}
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
store.actions.reset({ render: true })
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
