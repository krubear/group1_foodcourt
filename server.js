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

// Users

server.get('/data/users', async (request, response) =>{
  let result = await db.all("SELECT * FROM users")
  response.json(result)
})

// create new login
server.post('/data/login', async (request, response) =>{
  if(!request.body.password){
    return response.status(401).json({loggedIn: false, where: 1})
  }
  
  let query = "SELECT * FROM users WHERE user_name = ? AND password = ?"
  let result = await db.all(query, [request.body.user_name, request.body.password])
  
  if(result.length === 1){
    request.session.user = result[0]
    response.status(200).json({loggedIn: true})
  }else{
    delete(request.session.user)
    return response.status(401).json({loggedIn: false, where: 2})
  }
})

// get existing login
server.get('/data/login', async (request, response)=>{
  if(request.session && request.session.user){
    let user = request.session.user
    let query = "SELECT * FROM users WHERE user_name = ? AND password = ?"
    let result = await db.all(guery, [request.body.user_name, request.body.password])
    
    if(result.length === 1){
      response.json({response: "Welcome " + user.user_name + ", you are now logged in!"})
      return response.status(200).json({loggedIn: true})
    }else{
      delete(request.session.user)
    }
  }
  return response.status(401).json({loggedIn: false})
})

// logout
server.delete('/data/login', async (request, response)=>{
  delete(request.session.user)
  response.status(200).json({loggedIn: false})
})

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

//end