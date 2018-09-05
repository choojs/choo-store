var globals = [
  'DOMContentLoaded',
  'DOMTitleChange',
  'navigate',
  'popState',
  'pushState',
  'render',
  'replaceState'
]

/**
 * Create a new store.
 *
 * @param  {object} options - store options
 * @param  {string} options[].storeName - name of store - used for namespacing & debugging
 * @param  {object} options[].initialState - initial state of store - used for init & reset
 * @param  {object} options[].events - event functions
 * @return {function} - choo middleware function
 */
function createStore (options) {
  var { storeName, initialState, events } = options || {}

  if (typeof storeName !== 'string') throw new Error('storeName required')
  if (typeof initialState !== 'object') throw new Error('initialState required')
  if (typeof events !== 'object') throw new Error('events required')

  var props = Object.assign({}, options, { actions: {} })

  // API ref: https://github.com/choojs/choo#appusecallbackstate-emitter-app
  function store (state, emitter, app) {
    state[storeName] = deepClone(initialState)
    state.events = state.events || {} // be defensive
    state.events[storeName] = {}

    // add reset event if undefined
    if (!props.events.reset) {
      props.events.reset = ({ data, store, emitter }) => {
        var { render } = data || {}
        state[storeName] = deepClone(initialState)
        if (render) emitter.emit('render')
      }
    }

    Object.keys(events).forEach(event => {
      var eventName = globals.includes(event) ? event : `${storeName}:${event}`

      // attach events to emitter
      emitter.on(eventName, data => {
        events[event]({ data, store: state[storeName], emitter, state, app })
      })

      // don't create namespaced event hooks for global events
      if (!globals.includes(event)) {
        // add event names to state.events
        state.events[storeName][event] = eventName

        // add action method
        props.actions[event] = data => emitter.emit(eventName, data)
      }
    })
  }

  Object.assign(store, props)

  return store
}

function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = createStore
