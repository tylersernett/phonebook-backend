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