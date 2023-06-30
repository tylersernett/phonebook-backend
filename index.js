//hour used: 1.5
const express = require('express')
const app = express()
let phonebook = require('./persons.json')

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

app.use(express.json())

app.get('/api/persons', (request, response) => {
  response.send(phonebook)
})

app.get('/info', (request, response) => {
  const timestamp = new Date().toString();
  const entryCount = phonebook.length;
  response.send(
    `Phonebook has info for ${entryCount} people <br/> ${timestamp}`
  );
})

const generateId = () => {
  const maxId = phonebook.length > 0
    ? Math.max(...phonebook.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find(person => person.id === id);
  if (person) {
    response.send(person)
  } else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter(person => person.id !== id);
  console.log(phonebook)
  response.status(204).end()
})