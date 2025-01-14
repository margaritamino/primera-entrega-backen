import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Ruta para crear un carrito
router.post('/', (req, res) => {
  const carritos = JSON.parse(fs.readFileSync(path.resolve('src/data/carrito.json')));

  const newCart = {
    id: String(Date.now()), // Se genera un ID único
    products: []
  };

  carritos.push(newCart);
  fs.writeFileSync(path.resolve('src/data/carrito.json'), JSON.stringify(carritos, null, 2));

  res.status(201).json(newCart);
});

// Ruta para obtener los productos de un carrito
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carritos = JSON.parse(fs.readFileSync(path.resolve('src/data/carrito.json')));

  const carrito = carritos.find(c => c.id === cid);
  if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

  res.json(carrito.products);
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const carritos = JSON.parse(fs.readFileSync(path.resolve('src/data/carrito.json')));
  const productos = JSON.parse(fs.readFileSync(path.resolve('src/data/productos.json')));

  const carrito = carritos.find(c => c.id === cid);
  const producto = productos.find(p => p.id === pid);

  if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  // Verificar si el producto ya existe en el carrito
  const existingProduct = carrito.products.find(p => p.product === pid);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    carrito.products.push({ product: pid, quantity });
  }

  fs.writeFileSync(path.resolve('src/data/carrito.json'), JSON.stringify(carritos, null, 2));

  res.status(201).json(carrito);
});

export default router;
