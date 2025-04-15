import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Comment as CommentIcon,
  FilePresent as FileIcon,
} from '@mui/icons-material';

// Mock data for demonstration
const mockReports = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  patientId: `P${Math.floor(10000 + Math.random() * 90000)}`,
  accessionNumber: `ACC${Math.floor(100000 + Math.random() * 900000)}`,
  reportName: `Report_${Math.floor(10000 + Math.random() * 90000)}.pdf`,
  uploadDate: new Date(2024, 0, Math.floor(1 + Math.random() * 30)).toLocaleDateString(),
  reviewer: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'][Math.floor(Math.random() * 3)],
  hasComments: Math.random() > 0.5,
}));

const Reports = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredReports = mockReports.filter(
    (report) =>
      report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.accessionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReport = (reportId) => {
    console.log('Viewing report:', reportId);
    // Add your view report logic here
  };

  const handleDownloadReport = (reportId) => {
    console.log('Downloading report:', reportId);
    // Add your download report logic here
  };

  const handleViewComments = (reportId) => {
    console.log('Viewing comments for report:', reportId);
    // Add your view comments logic here
  };

  const handleExportResults = () => {
    console.log('Exporting filtered results');
    // Add your export logic here
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportResults}
        >
          Export Results
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search by Patient ID, Accession Number, or Report Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Accession #</TableCell>
              <TableCell>Report Name</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Reviewer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>{report.patientId}</TableCell>
                  <TableCell>{report.accessionNumber}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileIcon color="primary" />
                      {report.reportName}
                    </Box>
                  </TableCell>
                  <TableCell>{report.uploadDate}</TableCell>
                  <TableCell>{report.reviewer}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={report.hasComments ? 'With Comments' : 'No Comments'}
                      color={report.hasComments ? 'info' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewReport(report.id)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                      {report.hasComments && (
                        <IconButton
                          size="small"
                          onClick={() => handleViewComments(report.id)}
                          color="info"
                        >
                          <CommentIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Reports; 