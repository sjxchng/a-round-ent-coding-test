import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ui components to build card layout
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import DeleteIcon from '@mui/icons-material/Delete';

const ProductList = () => {

  // products <- the list of products shown on the screen
  // setProducts <- the function to update it
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {

    // sends an http get request
    axios.get('http://localhost:5001/api/products')
      // runs if the request succeeds
      .then((response) => {
        // store the returned products in state so React re-renders the UI
        setProducts(response.data);
      })
      // runs if the request fails
      .catch((error) => {
        // print error msg
        console.error(error);
      });
  };

  //implement the delete function
  const handleDelete = (id) => {
    // call the backend DELETE endpoint with the product id
    axios.delete(`http://localhost:5001/api/products/${id}`)
      .then(() => {
        // remove the deleted product from state so the card disappears without re-fetching
        setProducts((prevProducts) => {
          // filter() creates a new array that keeps every product except the one w/ id that matches
          return prevProducts.filter((product) => {
            return product.id !== id;
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // run fetchProducts when the component first appears on screen
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    // Container centers everything on the screen and limits the max width
    <Container maxWidth="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" style={{ marginTop: '20px', marginBottom: '20px' }}>
        Simple Card List
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {products.map((product) => {
          return (
            // xs/sm/md controls how many columns the card takes up at different screen sizes
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <div style={{ position: 'relative' }}>
                  <IconButton
                    style={{ position: 'absolute', top: '8px', left: '8px', color: 'red' }}
                    onClick={() => { handleDelete(product.id); }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                  />
                </div>
                <CardContent>
                  <Typography variant="h6">
                    {product.name}
                  </Typography>
                  <Typography variant="body1">
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ProductList;