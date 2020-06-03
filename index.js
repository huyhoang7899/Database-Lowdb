const express = require('express')
const app = express()
const port = 3000
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

db.defaults({ todos: []})
  .write()

app.get('/todos', function(req, res) {
	res.render('todos/index', {
		todos: db.get('todos').value()
	});
});

app.get('/todos/search', function(req, res)  {
	var q = req.query.q;
	var matchedTodos = db.get('todos').value();
	if (q) {
		matchedTodos = db.get('todos').value().filter(function(todo) {
			return todo.content.toLowerCase().indexOf(q.toLowerCase()) !== -1;
		});
	}
	
	res.render('todos/index', {
		todos: matchedTodos,
		q: q
	});
});

app.get('/todos/create', function(req, res) {
	res.render('todos/create');
});

app.post('/todos/create', function(req, res) {
	db.get('todos').push(req.body).write();
	res.redirect('/todos');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
