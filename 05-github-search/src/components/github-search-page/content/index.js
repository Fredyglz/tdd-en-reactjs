import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

const tableHeaders = [
  'Repository',
  'Stars',
  'Forks',
  'Open issues',
  'Updated at',
];

export const Content = ({ isSearchApplied, reposList }) => {
  if (isSearchApplied && !!reposList.length) {
    return (
      <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((name) => (
                  <TableCell key={name}>{name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reposList.map(
                ({
                  id,
                  name,
                  owner: { avatar_url: avatarUrl },
                  stargazers_count: stargazersCount,
                  forks_count: forksCount,
                  open_issues_count: openIssuesCount,
                  updated_at: updatedAt,
                  html_url: htmlUrl,
                }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <Avatar src={avatarUrl} alt={name} />
                      <Link href={htmlUrl}>{name}</Link>
                    </TableCell>
                    <TableCell>{stargazersCount}</TableCell>
                    <TableCell>{forksCount}</TableCell>
                    <TableCell>{openIssuesCount}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[30, 50, 100]}
          component="div"
          count={1}
          rowsPerPage={30}
          page={0}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
        />
      </>
    );
  }

  if (isSearchApplied && !reposList.length) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={400}
      >
        <Typography>Your search has no results</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={400}
    >
      <Typography>
        Please provide a search option and click in the search button
      </Typography>
    </Box>
  );
};

Content.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
  reposList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
