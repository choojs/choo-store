var devtools = require('choo-devtools')
var store = require('./store')
var view = require('./view')
var app = require('choo')()

app.route('/', view)
app.use(devtools())
app.use(store)
app.mount('body')
