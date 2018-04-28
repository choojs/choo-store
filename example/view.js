var html = require('choo/html')
var store = require('./store')

var { actions } = store

module.exports = (state, emit) => {
  return html`
    <body>
      <h1>count is ${state.clicks.count}</h1>
      <button onclick=${e => actions.increment(1)}>Increment</button>
      <button onclick=${e => actions.reset({ render: true })}>Reset</button>
    </body>
  `
}
