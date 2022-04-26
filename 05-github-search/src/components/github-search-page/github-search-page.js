import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { Content } from './content/index';
import { getRepos } from '../../services/index';

function GithubSearchPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [reposList, setReposList] = useState([]);

  const handleClick = async () => {
    setIsSearching(true);

    const response = await getRepos();

    const data = await response.json();
    setReposList(data.items);
    setIsSearchApplied(true);
    setIsSearching(false);
  };

  return (
    <Container>
      <Typography variant="h3" component="h1">
        Github repositories list
      </Typography>

      <Grid container spacing={6} justifyContent="space-between">
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="Filter by"
            id="filterBy"
            variant="standard"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Button
            fullWidth
            disabled={isSearching}
            color="primary"
            variant="contained"
            onClick={handleClick}
          >
            search
          </Button>
        </Grid>
      </Grid>
      <Content isSearchApplied={isSearchApplied} reposList={reposList} />
    </Container>
  );
}

export default GithubSearchPage;
