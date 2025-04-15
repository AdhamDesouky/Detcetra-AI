import React from 'react';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';

const LoadingSkeleton = ({ type = 'table' }) => {
  if (type === 'table') {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={60}
            sx={{ mb: 1 }}
          />
        ))}
      </Box>
    );
  }

  if (type === 'card') {
    return (
      <Grid container spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === 'form') {
    return (
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
    );
  }

  return null;
};

export default LoadingSkeleton; 