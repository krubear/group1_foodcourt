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





//get menu_items 

server.get('/data/menu_items/',async(request,response) =>{  

  let result = await db.all("SELECT * FROM menu_items")
  response.json(result)
  

})




// get menu_items with specific id
server.get('/data/menu_items/:menu_item_id',async(request,response) =>{ 
    
  let result = await db.all("SELECT * FROM menu_items WHERE menu_item_id =?", [request.params.menu_item_id ]) 

  response.json(result)


 


})

//post
server.post('/data/menu_items/',async(request,response) =>{ 
    

  let result = await db.run("INSERT INTO menu_items (name,price) VALUES (?, ?)", [request.body.name, request.body.price])

  response.json({"added": request.body})
  


})


//put menu_items, update
server.put('/data/menu_items/:menu_item_id',async(request,response) =>{ 
  let result = await db.run("UPDATE menu_items SET name = ?, price = ? WHERE menu_item_id = ?", [request.body.name, request.body.price, request.params.menu_item_id]) 

 
  response.json({result, message:"Menuitem updated"})

})


server.delete('/data/menu_items/:menu_item_id',async(request,response) =>{ 
    

  let result = await db.run("DELETE FROM menu_items WHERE menu_item_id =?", [request.params.menu_item_id]) 

  response.json({result, message:"Menuitem deleted"})
})


