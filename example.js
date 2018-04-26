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

var { actions } = store

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.clicks.count}</h1>
      <button onclick=${e => actions.increment(1)}>Increment</button>
      <button onclick=${e => actions.reset({ render: true })}>Reset</button>
    </body>
  `
}
