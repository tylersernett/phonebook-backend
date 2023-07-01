//hour used: 5.5
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
let phonebook = require('./persons.json')
const person = require('./models/person')

//MIDDLEWARE
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postJSON'));
morgan.token('postJSON', function (req, res) { return JSON.stringify(req.body) })


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  const timestamp = new Date().toString();
  Person.countDocuments({}).then(count =>
    response.send(
      `Phonebook has info for ${count} people <br/> ${timestamp}`
    ))
})

// const generateId = () => {
//   const maxId = phonebook.length > 0
//     ? Math.max(...phonebook.map(n => n.id))
//     : 0
//   return maxId + 1
// }

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  // const existingPerson = phonebook.find(person => person.name === body.name)
  // if (existingPerson) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

  // phonebook = phonebook.concat(person)
  // response.json(person)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
// const person = phonebook.find(person => person.id === id);
// if (person) {
//   response.send(person)
// } else {
//   response.status(404).end();
// }

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter(person => person.id !== id);
  console.log(phonebook)
  response.status(204).end()
})

// app.put('/api/persons/:id', (request, response) => {
//   console.log(request.body)
//   const id = Number(request.params.id);
//   const personToUpdate = phonebook.find(person => person.id === id);
//   console.log(personToUpdate)
//   response.status(204).end()
// })

//404 and 400 handling \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler) //ALWAYS GOES LAST
