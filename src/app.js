import express from 'express';
import { Server as SocketIO } from 'socket.io';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { create } from 'express-handlebars';

// Crear la aplicación de Express
const app = express();
const server = http.createServer(app);
const io = new SocketIO(server); 

// Configurar Handlebars como motor de plantillas
const hbs = create({ extname: '.handlebars' });  
app.engine('handlebars', hbs.engine);  
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// Configuración de carpeta estática
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Leer productos desde el archivo JSON de manera asíncrona
const productos = JSON.parse(await fs.promises.readFile(path.join(process.cwd(), 'src', 'data', 'productos.json'), 'utf-8'));

// Rutas
app.get('/products', (req, res) => {
  res.render('index', { productos });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos });
});

// Crear un nuevo producto
app.post('/createProduct', async (req, res) => {
  const newProduct = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: parseFloat(req.body.price),
    status: true,
    stock: parseInt(req.body.stock),
    category: req.body.category,
    thumbnails: []
  };

  productos.push(newProduct);
  await fs.promises.writeFile(path.join(process.cwd(), 'src', 'data', 'productos.json'), JSON.stringify(productos, null, 2));
  io.emit('newProduct', newProduct); 
  res.redirect('/products');
});

// Eliminar un producto
app.post('/deleteProduct', async (req, res) => {
  const productId = req.body.id;
  const index = productos.findIndex(product => product.id === productId);
  if (index !== -1) {
    productos.splice(index, 1);
    await fs.promises.writeFile(path.join(process.cwd(), 'src', 'data', 'productos.json'), JSON.stringify(productos, null, 2));
    io.emit('deleteProduct', productId); 
  }
  res.redirect('/products');
});

// Configurar el servidor para escuchar en el puerto 8080
server.listen(8080, () => {
  console.log('Servidor funcionando en http://localhost:8080');
});
