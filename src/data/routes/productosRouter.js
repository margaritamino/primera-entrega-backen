// src/data/routes/productosRouter.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Ruta para obtener todos los productos con límite
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  const productos = JSON.parse(fs.readFileSync(path.resolve('src/data/productos.json')));

  if (limit > 0) {
    return res.json(productos.slice(0, limit));
  }

  res.json(productos);
});

// Ruta para obtener un producto por su ID
router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const productos = JSON.parse(fs.readFileSync(path.resolve('src/data/productos.json')));

  const producto = productos.find(p => p.id === pid);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  res.json(producto);
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
  const productos = JSON.parse(fs.readFileSync(path.resolve('src/data/productos.json')));

  const newProduct = {
    id: String(Date.now()),  // Se genera un ID único basado en el timestamp
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: thumbnails || []
  };

  productos.push(newProduct);
  fs.writeFileSync(path.resolve('src/data/productos.json'), JSON.stringify(productos, null, 2));

  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto
router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  const productos = JSON.parse(fs.readFileSync(path.resolve('src/data/productos.json')));
  const productoIndex = productos.findIndex(p => p.id === pid);

  if (productoIndex === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  // No actualizar el ID, solo los campos permitidos
  const updatedProduct = { ...productos[productoIndex], title, description, code, price, status, stock, category, thumbnails };
  productos[productoIndex] = updatedProduct;

  fs.writeFileSync(path.resolve('src/data/productos.json'), JSON.stringify(productos, null, 2));

  res.json(updatedProduct);
});

// Ruta para eliminar un producto
router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const productos = JSON.parse(fs.readFileSync(path.resolve('src/data/productos.json')));

  const updatedProducts = productos.filter(p => p.id !== pid);

  if (updatedProducts.length === productos.length) return res.status(404).json({ error: 'Producto no encontrado' });

  fs.writeFileSync(path.resolve('src/data/productos.json'), JSON.stringify(updatedProducts, null, 2));

  res.status(204).end();
});

export default router;
