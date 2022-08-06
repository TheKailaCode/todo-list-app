// Declare variables
const { response } = require('express')
const express = require('express')
const app = express()
const PORT = 8000
const mongoose = require('mongoose')
require('dotenv').config()
const TodoTask = require('./models/TodoTask')

// Set middleware
app.set('view engine', 'ejs')
app.use(express.static('public')) //Where to look to get CSS styles and plain HTML -- tells express to look in the public folder
app.use(express.urlencoded({ extended: true })) // url parser makes sure we are getting the type of info we ar4e expecting- sending paths back and forth - helps validate the info passed back and forth user created so can be anything. extended helps us pass more complex things such as arrays and objects 

mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => { console.log('Connected to db!') }) // LOOK IN THE APPROPRIATE LOCATION FOR CONNECTION VARIABLE 

// GET METHOD - READ
app.get('/', async (req, res) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            res.render('index.ejs', { todoTasks: tasks })
        })
    } catch (err) {
        if (err) return res.status(500).send(err)
    }
}
)

// POST METHOD - CREATE
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    } catch (err) {
        if (err) return res.status(500).send(err)
        res.redirect('/')
    }
})

// PUT - EDIT or UPDATE METHOD
app
    .route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id
        TodoTask.find({}, (err, tasks) => {
            res.render('edit.ejs', {
                todoTasks: tasks, idTask: id
            })
        })
    })
    .post(((req, res) => {
        const id = req.params.id
        TodoTask.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content
            },
            err => {
                if (err) return res.status(500).send(err)
                res.redirect('/')
            }
        )
    }))

// DELETE 

app
    .route('/remove/:id')
    .get((req, res) => {
        const id = req.params.id
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.status(500).send(err)
            res.redirect('/')
        })
    })


app.listen(PORT, () => console.log(`Server is running on ${PORT}`))