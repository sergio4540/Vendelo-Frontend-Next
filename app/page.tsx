"use client"; // This is a client component
import { useState, useEffect } from 'react';
import axiosInstance from '../app/utils/axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField, Typography, Container, Card, CardContent, CardActions } from '@mui/material';
import { Alert } from '@mui/material';

interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

const ProductsPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<Producto>();

  // Efecto para eliminar mensajes después de 2 segundos
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 2000); // 2 segundos

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 2000); // 2 segundos

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axiosInstance.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const onCreate: SubmitHandler<Producto> = async (data) => {
    try {
      if (editingProduct) {
        await axiosInstance.put(`/productos/${editingProduct.id}`, data);
        setSuccessMessage('Producto actualizado exitosamente.');
      } else {
        await axiosInstance.post('/productos', data);
        setSuccessMessage('Producto guardado exitosamente.');
      }
      
      fetchProductos(); // Actualiza la lista de productos
      reset(); // Limpia el formulario
      setEditingProduct(null); // Resetea el estado de edición
      setErrorMessage(null); // Limpia mensajes de error
    } catch (error) {
      console.error('Error creating/updating product:', error);
      setErrorMessage('Ocurrió un error al guardar el producto.');
      setSuccessMessage(null);
    }
  };
  
  

  const onEdit = (product: Producto) => {
    setEditingProduct(product);
    reset(product);
  };

  const onDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/productos/${id}`);
      fetchProductos();
      reset(); // Limpiar el formulario aquí
      setSuccessMessage('Producto eliminado exitosamente.');
      setErrorMessage(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Ocurrió un error al eliminar el producto.');
      setSuccessMessage(null);
    }
  };
  

  return (
    
      <><div>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      
    </div>
    
    <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Productos
        </Typography>
        <form onSubmit={handleSubmit(onCreate)}>
          <TextField
            {...register('nombre', { required: 'Nombre es obligatorio' })}
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiFormLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'primary',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary',
                },
              }
            }} />
          <TextField
            {...register('descripcion', { required: 'Descripción es obligatoria' })}
            label="Descripción"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            sx={{
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiFormLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'primary',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary',
                },
              }
            }} />
          <TextField
            type="number"
            {...register('precio', { required: 'Precio es obligatorio' })}
            label="Precio"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
              '& .MuiInputBase-input': {
                color: 'white',
              },
              '& .MuiFormLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'primary',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary',
                },
              }
            }} />
          <Button type="submit" variant="contained" color="primary" sx={{ marginBottom: 4 }}>
            {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </form>
        {productos.map(product => (
          <Card key={product.id} variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{product.nombre}</Typography>
              <Typography variant="body2">{product.descripcion}</Typography>
              <Typography variant="body2">Precio: ${product.precio}</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => onEdit(product)} color="primary">
                Editar
              </Button>
              <Button onClick={() => onDelete(product.id!)} color="secondary">
                Eliminar
              </Button>
            </CardActions>
          </Card>
        ))}
      </Container></>
  );
};

export default ProductsPage;

