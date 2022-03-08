const express = require('express')
const server = express()
server.use(express.json())

server.use((request, response, next)=>{
    response.setHeader('X-Created-by', 'Grupp1')
    next()
})

const session = require('express-session')
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

// orders
server.get('/data/orders', async (request, response) =>{
  let result = await db.all("SELECT * FROM orders")
  response.json(result)
})
// get orders from order_id
server.get('/data/oders/:id', async (response, request)=>{
    let result = await db.all("SELECT * FROM orders WHERE id = ?", [request.params.id])
    response.json(result)
})

// post order data 
server.post('/data/orders', async (request, response)=>{
  if(!request.body.password){
    return response.json({loggedIn: false})
}
  
  let query = "SELECT * FROM orders WHERE"
  let result = await db.all(query, [request.body.order_id])
  if(result === 1){

  }


})