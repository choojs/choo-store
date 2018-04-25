var choo = require('choo')
var html = require('choo/html')
var devtools = require('choo-devtools')
var createStore = require('./')

var store = createStore({
  storeName: 'clicks',
  initialState: { count: 0 },
  events: {
    increment: ({ data, store, emitter }) => {
      store.count += data
      emitter.emit('render')
    }
  }
})

var app = choo()
app.route('/', mainView)
app.use(devtools())
app.use(store)
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
    emit(state.events.clicks.increment, 1)
  }

  function reset () {
    emit(state.events.clicks.reset, { render: true })
  }
}
