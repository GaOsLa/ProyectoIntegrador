//declaramos la dependecia dotenv
const dotenv = require('dotenv');
      dotenv.config();
//agregamos la referencia al MongoDB con Node.js
const { MongoClient, ServerApiVersion } = require('mongodb');

// busco los datos de coneccion en el .env
const URI = process.env.MONGODB_URLSTRING;



// const client = new MongoClient(URI);

const client = new MongoClient(URI, 
      {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
  );

async function connectToMongoDB() {
      try {
          await client.connect();
                console.log('Conectado a MongoDB');
            //     await client.db("admin").command({ ping: 1 });
            //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
          return client;
      } catch (error) {
              console.error('Error al conectar a MongoDB:', error);
          return null;
      }
}

async function disconnectFromMongoDB() {
      try {
        await client.close();
              console.log('Desconectado de MongoDB');
      } catch (error) {
            console.error('Error al desconectar de MongoDB:', error);
      }
}

module.exports = { connectToMongoDB, disconnectFromMongoDB };
