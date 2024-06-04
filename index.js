const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT | 5000;

app.use(express.json());
app.use(cors());



//gpeYJ3jTyAALnHAr
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb://rizonrahat199:gpeYJ3jTyAALnHAr@ac-jif2aos-shard-00-00.u9sh80h.mongodb.net:27017,ac-jif2aos-shard-00-01.u9sh80h.mongodb.net:27017,ac-jif2aos-shard-00-02.u9sh80h.mongodb.net:27017/?ssl=true&replicaSet=atlas-rzyffr-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    const blogCollection=client.db("blog").collection("blogs");
   
    app.get("/blog", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    })


    app.post('/products',async (req, res) => {
      try {
        const { category, title, quantity, description } = req.body;
       
  
        const newProduct = {
          category,
          title,
          quantity: parseInt(quantity),
          description,
          
        };
  
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
      } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'An error occurred while adding the product' });
      }
    });

    app.get("/products/:id", async (req, res) => {
      const id=req.params.id;
     const query={
      _id : new ObjectId(id)
     }
      const result = await productCollection.findOne(query) ;
      res.send(result);
    });

    app.put('/products/:id/donate', async (req, res) => {
      const id = req.params.id;
      const { quantity } = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $inc: { quantity: quantity },
      };
      const result = await productCollection.updateOne(query, updateDoc);
      res.send(result);
    });

  
 // Route for updating a product
 app.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { category, title, quantity } = req.body;

    const updatedProduct = {
      category,
      title,
      quantity: parseInt(quantity),
    };

    const result = await productCollection.findOneAndUpdate(
      { _id: new mongo.ObjectId(productId) },
      { $set: updatedProduct },
      { returnOriginal: false }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.value);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'An error occurred while updating the product' });
  }
});

// Route for deleting a product
app.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const result = await productCollection.findOneAndDelete({ _id: new mongo.ObjectId(productId) });

    if (!result.value) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
});



  } finally {
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Job Task Planner server")
})

app.listen(port, () => {
  console.log(`Port number ${port}`);
})