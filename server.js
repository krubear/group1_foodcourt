const { response } = require('express')
const express = require('express')
const server = express()
server.use(express.json())

server.use((request, response, next)=>{
    response.setHeader('X-Created-by', 'Grupp1')
    next()
})

const session = require('express-session')
const { request } = require('http')
server.use(session({
  secret: 'seoåkdhrifåwoeidfhåäwosdfn',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // CHANGE TO true WHEN GOING LIVE!!!! preferable using an environmental variable
}))

server.listen(3000, ()=>{
    console.log('Server running at http://localhost:3000/data')
})

const sqlite3 = require('sqlite3')

const util = require('util')
const { resourceLimits } = require('worker_threads')

const db = new sqlite3.Database('./database/G1foodcourt.db')
db.all = util.promisify(db.all)
db.run = util.promisify(db.run)

// customers

server.get('/data/customers', async(request, response)=>{
  let result = await db.all("SELECT * FROM customers")

  response.json(result)
})

server.get('/data/customers/:customer_id', async(request, response)=>{
  let result = await db.all("SELECT * FROM customers WHERE customer_id = ?", [request.params.customer_id])

  response.json(result)
})

server.post('/data/customers', async(request, response)=>{
  let result = await db.run("INSERT INTO customers (firstname, lastname, adress, phone) VALUES(?, ?, ?, ?)", [request.body.firstname, request.body.lastname, request.body.adress, request.body.phone])
  response.json(result)
})

server.put('/data/customers/:customer_id', async(request, response)=>{

  let result = await db.run("UPDATE customers SET firstname = ?, lastname = ?, adress = ?, phone = ? WHERE customer_id = ?", [request.body.firstname, request.body.lastname, request.body.adress, request.body.phone, request.params.customer_id])
  response.json(result)
})

server.delete('/data/customers/:id', async(request, response)=>{

  let result = await db.run("DELETE FROM customers WHERE id = ?", [request.params.id])
  response.json(result)
})

// menus

server.get('/data/menus', async(request, response)=>{
  let result = await db.all("SELECT * FROM menus")
  respone.json(result)
})