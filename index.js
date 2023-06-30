//hour used: 1.5
const express = require('express')
const app = express()
const db = require('./persons.json')

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

app.use(express.json())

app.get('/api/persons', (request, response) => {
  response.send(db)
})