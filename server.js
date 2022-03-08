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


//allt som finns i restaurants
server.get('/data/restaurants/:restaurant_id', async (request, response)=>{
  let result = await db.all("SELECT * FROM restaurants WHERE restaurant_id = ?", [request.params.id])
  response.json(result)
})

//skapa en ny restaurang
server.post('/data/restaurants', async (request, response)=>{
  let result = await db.run("INSERT INTO restaurants (restaurant_id, name, resturant_adress, type_of_cuisine) VALUES(?) ", [request.body.name])
  response.json(result)
})

//uppdatera en restaurang
server.put('/data/restaurants/:restaurant_id', async (request, response)=>{
  let result = await db.run("UPDATE restaurants SET name = ?, resturant_adress = ?, type_of_cuisine = ? WHERE restaurant_id = ?", [request.body.name, request.body.resturant_adress, request.body.type_of_cuisine, request.params.restaurant_id])
  response.json(result)
})

//delete en restaurant
server.delete('/data/restaurants/:restaurant_id', async (request, response)=>{
  let result = await db.run("DELETE FROM restaurants WHERE restaurant_id = ?", [request.params.id])
  response.json(result)
})