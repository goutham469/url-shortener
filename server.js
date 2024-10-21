const { error } = require('console')
const exp = require('express')
const cors = require('cors')
const DBAccess = require('./MiddleWares/DBAccess')
const UpdateStats = require('./MiddleWares/UpdateStats')
const CheckUser = require('./MiddleWares/CheckUser')
const APICounter = require('./MiddleWares/APICounter')



const app = exp()
app.use(cors())

require('dotenv').config()
const mclient = require('mongodb').MongoClient

mclient.connect(process.env.MONGO_URL).then(client => {
    const DB = client.db('urlShortener')

    const urlsCollection = DB.collection('urls')
    const metaCollection = DB.collection('meta')
    const usersCollection = DB.collection('users')

    app.set("urlsCollection" , urlsCollection)
    app.set("metaCollection" , metaCollection)
    app.set("usersCollection" , usersCollection)

    console.log("mongoDB connection success !")
}).catch((err) => {
    console.log("error during connection with MongoDB \n",err)
})

app.use(exp.json())
app.use(DBAccess)
app.use(APICounter)


app.get("/",(req,res)=>{
    res.send("URL shortener . A project made by Goutham reddy.")
})

// Define the sequence of characters we are working with
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function incrementSequence(seq) {

    let sequence = seq.split('');
    
    // Start incrementing from the last character
    let carry = 1;
    for (let i = sequence.length - 1; i >= 0; i--) {
        if (carry === 0) break;
        
        // Find the current character index in the 'chars' string
        let currentIndex = chars.indexOf(sequence[i]);
        
        // Increment the index
        let newIndex = (currentIndex + carry) % chars.length;
        
        // Set the new character
        sequence[i] = chars[newIndex];
        
        // Determine if there's a carry
        carry = currentIndex + carry >= chars.length ? 1 : 0;
    }

    // If there's still a carry, prepend a new character (like incrementing the number of digits)
    if (carry) {
        sequence.unshift(chars[0]);
    }
    
    return sequence.join('');
}

app.post('/create-link',CheckUser ,async(req,res)=>{

    let currentState = await req.metaCollection.find({id:1}).toArray()
    currentState = currentState[0]
    currentState = currentState.counter;

    let newKey = incrementSequence(currentState)
    await req.metaCollection.updateOne({id:1} , {$set:{counter : newKey}})

    let response = await req.urlsCollection.insertOne({key : newKey , url:req.body.url , views:0, owner:req.body.owner , ipAdrs:[] , stats:{daily:[] , monthly:[]}})

    res.send({
        status:true,
        tinyUrl : newKey
    })
})

app.post('/login' , async (req,res)=>{
    let response = await req.usersCollection.find({email:req.body.email}).toArray()
    if(response.length > 0)
    {
       res.send({status:true , message:"login success"})
    }
    else
    {
       response = await req.usersCollection.insertOne({"email":req.body.email,"img":req.body.img})
       res.send(response)
    }
})

app.get('/all-users' , async(req,res)=>{
    let data = await req.usersCollection.find().toArray()
    res.send(data)
})

app.get('/all-urls' , async(req,res)=>{
    let data = await req.urlsCollection.find().toArray()
    res.send(data)
})

app.get('/meta' , async(req,res)=>{
    let data = await req.metaCollection.find({id:1}).toArray()

    res.send(data[0])
})

app.get('*' , async(req,res)=>{
    let path = req.path
    path = path.substring(1,)
    console.log(path)

    let data = await req.urlsCollection.find({key:path}).toArray()
    if(data[0])
    {
        UpdateStats(path , req , data[0])
        
        res.redirect(data[0].url)
    }
    else
    {
        res.send("Link not found on our servers .Thats all we know.")
    }
})

app.listen(4000 , ()=>{console.log("URL shortener server running on PORT 4000...")})