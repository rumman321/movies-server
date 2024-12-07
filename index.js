const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.emoxy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const movieCollection =client.db('movieDB').collection('movies')
    const favoriteCollection =client.db('movieDB').collection('favorites')

    app.post("/movie",async (req,res)=>{
        const newMovie=req.body
        console.log(newMovie)
        const result = await movieCollection.insertOne(newMovie)
        res.send(result)
    })

    app.get("/movie", async (req, res) => { 
       const movies = await movieCollection.find({}).maxTimeMS(60000).toArray();
        res.send(movies);})

        app.delete("/movie/:id",async (req,res)=>{
          const id=req.params.id
          const query= {_id : new ObjectId(id)}
          const result = await movieCollection.deleteOne(query)
          res.send(result)
        })    

    //favorite collection part
    app.post('/favorites', async (req,res)=>{
      const fav=req.body
      console.log(fav)
      const result= await favoriteCollection.insertOne(fav)
      res.send(result)
    })

    app.get("/favorites", async (req, res) => { 
      const movies = await favoriteCollection.find({}).maxTimeMS(60000).toArray();
       res.send(movies);})
    
    app.delete("/favorites/:id",async (req,res)=>{
      const id=req.params.id
      const query= { _id : id}
      const result = await favoriteCollection.deleteOne(query)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('HOT HOT HOT ORCHID')
})

app.listen(port, () => {
    console.log(`COffee is getting warmer in port: ${port}`);
})



//
//