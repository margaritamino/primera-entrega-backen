import express from 'express';
import productos from '../productos.json';

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/products', (req, res) => {
  res.json(productos); 
});

// Ruta para agregar un nuevo producto
router.post('/products', (req, res) => {
  const newProduct = req.body;
  productos.push(newProduct); 
  res.status(201).json(newProduct); 
});

// Ruta para eliminar un producto
router.delete('/products/:id', (req, res) => {
  const { id } = req.params; 
  const index = productos.findIndex(p => p.id === id); 

  if (index !== -1) {
    productos.splice(index, 1);
    res.status(200).json({ message: 'Producto eliminado con éxito' });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

export default router;
