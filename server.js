const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

const mibd = "PrendasDB" //<<-------------------- convertir esta cadena igual a como  se llama tu bbdd en mongo
const micoll = "Prendas" //<<-------------------- convertir esta cadena igual a como  se llama tu collention en la bbdd en mongo

app.use(express.json());

app.use((req, res, next) => {
    // res.header("Content-Type", "application/json; charset=utf-8");
    next();
});
app.get('/', (req, res) => { res.status(200).end('¡Bienvenido a la API de Prendas!'); } );


app.get('/prendas', async (req, res) => {
    const client = await connectToMongoDB();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return('Error al conectarse a MongoDB');
    } 

        
        const db = client.db(mibd); //nombre base de datos a conectarse
        const prendas = await db.collection(micoll).find().toArray();
        
        console.log('obteniendo datos')
        console.log(prendas)
       
        res.json(prendas);
    
    // await disconnectFromMongoDB();

});

app.get('/prendas/:id', async (req, res) => {
    const prendaId = req.params.id;
    const client = await connectToMongoDB();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return('Error al conectarse a MongoDB');
    } 

        
        const db = client.db(mibd); //nombre base de datos a conectarse
        const prenda = await db.collection(micoll).find(prendaId);
        
    // await disconnectFromMongoDB();
        //   !prenda ? res.status(404).send(`No se encontró la prenda con ID ${prendaId}`) : res.json(prenda)
          if (!prenda){
              res.json(prenda)
              console.log('if')
            } else {
                res.json(prenda)
                // res.status(404).send(`No se encontró la prenda con ID ${prendaId}`)
                console.log('else')
            }

  });
//-----------------------------------edita Gabriela-----------------------------------------------------
//   app.get('/prendas/nombre/:nombre', async (req, res) => {
//     const nombreprenda = req.params.nombre;
//     const client = await connectToMongoDB();
//           if (!client) {
//               res.status(500).send('Error al conectarse a MongoDB');
//               return;
//           }

//     const regex = new RegExp(nombreprenda.toLowerCase(), 'i')
          
    //  const db = client.db(mibd);
    // const prenda = await db.collection(micoll).find({ nombre: regex }).toArray();
//     await disconnectFromMongoDB();
//           !prenda ? res.status(404).send(`No se encontró la prenda: ${nombreprenda}`) : res.json(prenda)
//   });

//   app.get('/prendas/importe/:precio', async (req, res) => {
//     const precioprenda = parseInt(req.params.precio) || 0;
//     const client = await connectToMongoDB();
//           if (!client) {
//               res.status(500).send('Error al conectarse a MongoDB');
//               return;
//           }
          
//     const db = client.db(mibd);
//     const prenda = await db.collection('prendas').find({ importe: { $gte: precioprenda } }).toArray();
//     await disconnectFromMongoDB();
//           !prenda ? res.status(404).send(`No se encontró la prenda: ${nombreprenda}`) : res.json(prenda)
//   });
//------------------------------------------------Hasta aca edita Gabriela------------------------------------------------------

//   Crear
//   app.post('/prendas', async (req, res) => {
//         const nuevaprenda = req.body; //la prenda viene en el body
//               if (nuevaprenda === undefined) {
//                   res.status(400).send('Error en el formato de datos a crear.');
//               }

//         const client = await connectToMongoDB();
//               if (!client) {
//                   res.status(500).send('Error al conectarse a MongoDB');
//               }

//         const collection = client.db(mibd).collection('prendas'); //obtener colección
//               collection.insertOne(nuevaprenda)
//               .then(() => {
//                   console.log('Nueva prenda creada:');
//                   res.status(201).send(nuevaprenda);
//               })
//               .catch(error => {
//                   console.error(error);
//               })
//               .finally(()=> {
//                   client.close();
//               });
// });

// // Modificar
// app.put('/prendas/:id', async (req, res) => {
//     const id = req.params.id;
//     const nuevosDatos = await req.body;
          
//     if (!nuevosDatos) {
//         res.status(400).send('Error en el formato de datos recibido.');
//     }

//     const client = await connectToMongoDB();
//           if (!client) {
//               res.status(500).send('Error al conectarse a MongoDB');
//           }

//           const collection = client.db(mibd).collection('prendas');
//           collection.updateOne({ id: parseInt(id) }, { $set: nuevosDatos })
//           .then(() => {
//                 console.log('prenda modificada:');
//                 res.status(200).send(nuevosDatos);
//             })
//             .catch((error) => {
//                 res.status(500).json({descripcion: 'Error al modificar la prenda' });
//             })
//             .finally(()=> {
//                 client.close();
//             });
//   });
  
// // Eliminar
// app.delete('/prendas/:id', async (req, res) => {
//     const id = req.params.id;
//     if (!req.params.id) {
//         return res.status(400).send('El formato de datos es erróneo o inválido.');
//     }

//     const client = await connectToMongoDB();
//     if (!client) {
//         return res.status(500).send('Error al conectarse a MongoDB');
//     }

//     client.connect()
//       .then(() => {
//             const collection = client.db(mibd).collection('prendas'); //obtener colección
//             return collection.deleteOne({ id: parseInt(id) });
//       })
//       .then((resultado) => {
//         if (resultado.deletedCount === 0) {
//             res.status(404).send('No se encontró ninguna prenda con el ID proporcionado:', id);
//         } else {
//             console.log('prenda eliminada.');  
//             res.status(204).send();
//         }
//       })
//       .catch((error) => {
//             console.error(error);
//             res.status(500).send('Se produjo un error al intentar eliminar la prenda.');
//       })
//       .finally(() => {
//             client.close();
//       });
// });

app.listen(PORT, () => console.log(`API de prendas escuchando en http://localhost:${PORT}`) );
