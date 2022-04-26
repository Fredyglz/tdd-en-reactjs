import React, { useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import saveProduct from '../services/productServices';

import {
  CREATED_STATUS,
  ERROR_SERVER_STATUS,
  INVALID_REQUEST_STATUS,
} from '../consts/httpStatus';

function Form() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
  });

  const validateField = ({ name, value }) => {
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: value.length ? '' : `The ${name} is required`,
    }));
  };

  const validateForm = ({ name, size }) => {
    validateField({ name: 'name', value: name });
    validateField({ name: 'size', value: size });
  };

  const handleFetchErrors = async (err) => {
    if (err.status === ERROR_SERVER_STATUS) {
      setErrorMessage('Unexpected error, please try again');
      return;
    }

    if (err.status === INVALID_REQUEST_STATUS) {
      const data = await err.json();
      setErrorMessage(data.message);
      return;
    }

    setErrorMessage('Connection error, please try later');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const { name, size, type } = e.target.elements;

    validateForm({ name: name.value, size: size.value });

    try {
      const response = await saveProduct({
        name: name.value,
        size: size.value,
        type: type.value,
      });

      if (!response.ok) {
        throw response;
      }

      if (response.status === CREATED_STATUS) {
        e.target.reset();
        setIsSuccess(true);
      }
    } catch (err) {
      handleFetchErrors(err);
    }

    setIsSaving(false);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    validateField({ name, value });
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center">
        Create product
      </Typography>
      {isSuccess && <p>Product stored</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              label="name"
              name="name"
              variant="standard"
              helperText={formErrors.name}
              onBlur={handleBlur}
              error={!!formErrors.name.length}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="size"
              label="size"
              name="size"
              variant="standard"
              helperText={formErrors.size}
              onBlur={handleBlur}
              error={!!formErrors.size.length}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel variant="standard" htmlFor="type">
              Type
            </InputLabel>
            <NativeSelect
              fullWidth
              inputProps={{
                name: 'type',
                id: 'type',
              }}
            >
              <option value="electronic">Electronic</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
            </NativeSelect>
          </Grid>
          {/* {formErrors.type.length && <p>{formErrors.type}</p>} */}

          <Grid item xs={12}>
            <Button fullWidth disabled={isSaving} variant="text" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Form;
