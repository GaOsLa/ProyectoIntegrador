const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb');
const { Int32 } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

const mibd = "PrendasDB" //<<-------------------- convertir esta cadena igual a como  se llama tu bbdd en mongo
const micoll = "Prendas" //<<-------------------- convertir esta cadena igual a como  se llama tu collention en la bbdd en mongo

app.use(express.json());

app.use((req, res, next) => {
    next();
});
app.get('/', (req, res) => { res.status(200).end('¡Bienvenido a la API de Prendas!'); } );

// API listar todos los registros del servidor
app.get('/prendas', async (req, res) => {
    const client = await connectToMongoDB();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return('Error al conectarse a MongoDB');
    } 
        
    const db = client.db(mibd); //nombre base de datos a conectarse
    const prendas = await db.collection(micoll).find().toArray();
        
    console.log('obteniendo datos')
         
    res.json(prendas);

});

// find x codigo
app.get('/prendas/codigo/:codigo', async (req, res) => {
    const prendaId = parseInt(req.params.codigo); //parse.int es para convertir el dato de string a integer
    
    if (isNaN(prendaId)) {  //este if se incluye para verificar si prendaId contiene un numero, en caso negativo se devuelve un aviso al usuario
        console.log(prendaId, ' no es un numero')
        res.status(400).send('Datos invalidos, por favor ingrese un valor numérico');
        return;
      } else {

    const client = await connectToMongoDB();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return;
    } 

    const db = client.db(mibd); //nombre base de datos a conectarse
    const miColl = await db.collection(micoll); //nombre de la coleccion a utilizar
    
    const prenda = await miColl.find({codigo:prendaId}).toArray();

    if (!prenda){
        res.json(prenda)
        console.log('if')
    } else {
        res.json(prenda)
        console.log ('else')            
        }

  }
    }
  );

//Busqueda por nombre
app.get('/prendas/nombre/:nombre', async (req, res) => {
    const nombreprenda = req.params.nombre;
    const client = await connectToMongoDB();
         if (!client) {
             res.status(500).send('Error al conectarse a MongoDB');
              return;
         }

    const regex = new RegExp(nombreprenda.toLowerCase(), 'i')
    const db = client.db(mibd);
    const prenda = await db.collection(micoll).find({ nombre: regex }).toArray();
    await disconnectFromMongoDB();
         !prenda ? res.status(404).send(`No se encontró la prenda: ${nombreprenda}`) : res.json(prenda)
});

//   API Crear
app.post('/prendas', async (req, res) => {
    const nuevaprenda = req.body; //la prenda viene en el body
        if (nuevaprenda === undefined) {
            res.status(400).send('Error en el formato de datos a crear.');
        }

    const client = await connectToMongoDB();
        if (!client) {
            res.status(500).send('Error al conectarse a MongoDB');
        }

    const collection = client.db(mibd).collection(micoll); //obtener colección
          collection.insertOne(nuevaprenda)
            .then(() => {
                console.log('Nueva prenda creada:');
                res.status(201).send(nuevaprenda);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(()=> {
                client.close();
            });
});

// API Modificar
app.patch('/prendas/codigo/:codigo', async (req, res) => {
    const codigo = parseInt(req.params.codigo);
    const nuevosDatos = await req.body;


    if (isNaN(codigo)) {  //este if se incluye para verificar si prendaId contiene un numero, en caso negativo se devuelve un aviso al usuario

        res.status(400).send('Datos invalidos, por favor ingrese un valor numérico');
        return;

      } else if (!nuevosDatos){  

        res.status(400).send('Error en el formato de datos recibido.')
    } else {
        const client = await connectToMongoDB();
        
        if (!client) {
            res.status(500).send('Error al conectarse a MongoDB');
        }
        
        const collection = client.db(mibd).collection(micoll);
        collection.updateOne({ codigo: codigo }, { $set: nuevosDatos })
        .then(() => {
            console.log('prenda modificada:');
            res.status(200).send(nuevosDatos);
        })
        .catch((error) => {
            res.status(500).json({descripcion: 'Error al modificar la prenda' });
        })
        .finally(()=> {
            client.close();
        });
    }
  });
  

app.listen(PORT, () => console.log(`API de prendas escuchando en http://localhost:${PORT}`) );