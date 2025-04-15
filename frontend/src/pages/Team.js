import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Avatar,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Assignment as AssignIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

// Mock data for demonstration
const mockReviewers = [
  {
    id: 1,
    name: 'Dr. John Smith',
    email: 'john.smith@example.com',
    avatar: 'JS',
    assignedCases: 45,
    completedCases: 38,
    lastActive: '2 hours ago',
    status: 'online',
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'SJ',
    assignedCases: 32,
    completedCases: 28,
    lastActive: '5 minutes ago',
    status: 'online',
  },
  {
    id: 3,
    name: 'Dr. Michael Williams',
    email: 'm.williams@example.com',
    avatar: 'MW',
    assignedCases: 28,
    completedCases: 15,
    lastActive: '1 day ago',
    status: 'offline',
  },
];

const Team = () => {
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState({
    numberOfCases: '',
    priority: 'normal',
  });

  const handleOpenAssignDialog = (reviewer) => {
    setSelectedReviewer(reviewer);
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
    setSelectedReviewer(null);
    setAssignmentDetails({
      numberOfCases: '',
      priority: 'normal',
    });
  };

  const handleAssignCases = () => {
    console.log('Assigning cases:', {
      reviewer: selectedReviewer,
      ...assignmentDetails,
    });
    // Add your case assignment logic here
    handleCloseAssignDialog();
  };

  const getProgressColor = (completed, total) => {
    const percentage = (completed / total) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'primary';
    return 'warning';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Team Progress
      </Typography>

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mockReviewers.map((reviewer) => (
          <Grid item xs={12} md={4} key={reviewer.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    {reviewer.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{reviewer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reviewer.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reviewer.completedCases}/{reviewer.assignedCases} cases
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(reviewer.completedCases / reviewer.assignedCases) * 100}
                    color={getProgressColor(reviewer.completedCases, reviewer.assignedCases)}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {reviewer.lastActive}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={reviewer.status}
                    color={reviewer.status === 'online' ? 'success' : 'default'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reviewer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Assigned Cases</TableCell>
                <TableCell align="center">Completed Cases</TableCell>
                <TableCell align="center">Completion Rate</TableCell>
                <TableCell align="center">Last Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockReviewers.map((reviewer) => (
                <TableRow key={reviewer.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {reviewer.avatar}
                      </Avatar>
                      {reviewer.name}
                    </Box>
                  </TableCell>
                  <TableCell>{reviewer.email}</TableCell>
                  <TableCell align="center">{reviewer.assignedCases}</TableCell>
                  <TableCell align="center">{reviewer.completedCases}</TableCell>
                  <TableCell align="center">
                    {((reviewer.completedCases / reviewer.assignedCases) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell align="center">{reviewer.lastActive}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenAssignDialog(reviewer)}
                    >
                      <AssignIcon />
                    </IconButton>
                    <IconButton color="info">
                      <EmailIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Assign Cases Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog}>
        <DialogTitle>
          Assign Cases to {selectedReviewer?.name}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            fullWidth
            label="Number of Cases"
            type="number"
            value={assignmentDetails.numberOfCases}
            onChange={(e) => setAssignmentDetails(prev => ({
              ...prev,
              numberOfCases: e.target.value
            }))}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Priority"
            value={assignmentDetails.priority}
            onChange={(e) => setAssignmentDetails(prev => ({
              ...prev,
              priority: e.target.value
            }))}
            margin="normal"
          >
            <MenuItem value="high">High Priority</MenuItem>
            <MenuItem value="normal">Normal Priority</MenuItem>
            <MenuItem value="low">Low Priority</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignCases}
            disabled={!assignmentDetails.numberOfCases}
          >
            Assign Cases
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team; 