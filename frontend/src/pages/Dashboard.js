import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// Mock data for demonstration
const mockCases = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  patientId: `P${Math.floor(10000 + Math.random() * 90000)}`,
  accessionNumber: `ACC${Math.floor(100000 + Math.random() * 900000)}`,
  viewType: Math.random() > 0.5 ? 'CC' : 'MLO',
  laterality: Math.random() > 0.5 ? 'Left' : 'Right',
  aiPrediction: ['Normal', 'Rupture', 'Suspicious'][Math.floor(Math.random() * 3)],
  status: ['Pending', 'Reviewed', 'Flagged'][Math.floor(Math.random() * 3)],
  reviewer: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'][Math.floor(Math.random() * 3)],
  modality: ['Mammo', 'US', 'MRI'][Math.floor(Math.random() * 3)],
}));

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Reviewed':
      return 'success';
    case 'Flagged':
      return 'error';
    default:
      return 'default';
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    reviewer: '',
    label: '',
    modality: '',
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0);
  };

  const filteredCases = mockCases.filter((case_) => {
    return (
      (!filters.reviewer || case_.reviewer === filters.reviewer) &&
      (!filters.label || case_.aiPrediction === filters.label) &&
      (!filters.modality || case_.modality === filters.modality)
    );
  });

  const handleViewCase = (caseId) => {
    navigate(`/viewer/${caseId}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              name="reviewer"
              label="Filter by Reviewer"
              value={filters.reviewer}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Reviewers</MenuItem>
              <MenuItem value="Dr. Smith">Dr. Smith</MenuItem>
              <MenuItem value="Dr. Johnson">Dr. Johnson</MenuItem>
              <MenuItem value="Dr. Williams">Dr. Williams</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              name="label"
              label="Filter by Label"
              value={filters.label}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Labels</MenuItem>
              <MenuItem value="Normal">Normal</MenuItem>
              <MenuItem value="Rupture">Rupture</MenuItem>
              <MenuItem value="Suspicious">Suspicious</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              name="modality"
              label="Filter by Modality"
              value={filters.modality}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Modalities</MenuItem>
              <MenuItem value="Mammo">Mammogram</MenuItem>
              <MenuItem value="US">Ultrasound</MenuItem>
              <MenuItem value="MRI">MRI</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Cases Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Accession #</TableCell>
              <TableCell>View Type</TableCell>
              <TableCell>Laterality</TableCell>
              <TableCell>AI Prediction</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reviewer</TableCell>
              <TableCell>Modality</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCases
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((case_) => (
                <TableRow key={case_.id} hover>
                  <TableCell>{case_.patientId}</TableCell>
                  <TableCell>{case_.accessionNumber}</TableCell>
                  <TableCell>{case_.viewType}</TableCell>
                  <TableCell>{case_.laterality}</TableCell>
                  <TableCell>
                    <Chip
                      label={case_.aiPrediction}
                      color={case_.aiPrediction === 'Normal' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={case_.status}
                      color={getStatusColor(case_.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{case_.reviewer}</TableCell>
                  <TableCell>{case_.modality}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewCase(case_.id)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Dashboard; 