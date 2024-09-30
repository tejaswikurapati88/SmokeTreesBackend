const express= require('express')
const path= require('path')
const {open}= require('sqlite')
const sqlite3= require('sqlite3')
const app= express()
const cors= require('cors')

const dbPath= path.join(__dirname, 'userDetails.db')

app.use(express.json())
app.use(cors())

const port= process.env.port || 2999

let db= null

const initializeServer= async ()=>{
    try{
        db= await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(port, ()=>{
            console.log(`Server is running at http://localhost:${port}`)
        })
    }catch(e){
        console.log(`Server Error: ${e.message}`)
        process.exit(1)
    }
}

initializeServer()

app.get('/api/users', async (req, res)=>{
    const sqlQuery=`
    select * from user
    `
    const usersData= await db.all(sqlQuery)
    res.send(usersData)
})

app.get('/api/addresses', async (req, res)=>{
    const sqlAddressQuery=`
    select * from address;
    `
    const addresses= await db.all(sqlAddressQuery)
    res.send(addresses)
})

app.post('/api/register', async (req, res)=>{
    const data= req.body 
    const {userId, addressId, name, address}= data 
    const insertUserQuery= `
    insert into user (id, name)
    values ('${userId}', '${name}');
    `
    const insertAddressQuery=`
    insert into address (id, userid, address)
    values ('${addressId}', '${userId}', '${address}');
    `
    await db.run(insertAddressQuery)
    await db.run(insertUserQuery)
    res.send('inserted successfully')
})


module.exports= app