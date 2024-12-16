// src/app.js
import express from 'express';
import productosRouter from './data/routes/productosRouter.js';
import carritosRouter from './data/routes/carritosRouter.js';

const app = express();

// Middleware para parsear JSON en los requests
app.use(express.json());

// Rutas para productos y carritos
app.use('/api/products', productosRouter);
app.use('/api/carts', carritosRouter);

// Puerto en el que el servidor escuchará
app.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
