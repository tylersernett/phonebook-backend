//hour used: 1.5
const express = require('express')
const app = express()
const phonebook = require('./persons.json')

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

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find(person => person.id === id);
  if (person) {
    response.send(person)
  } else {
    response.status(404).end();
  }
})