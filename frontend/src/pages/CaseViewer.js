import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  TextField,
  Slider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Brightness6 as BrightnessIcon,
  Contrast as ContrastIcon,
  ThumbUp as AcceptIcon,
  ThumbDown as RejectIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

// Mock data for demonstration
const mockCase = {
  patientId: 'P12345',
  accessionNumber: 'ACC987654',
  age: 45,
  laterality: 'Left',
  viewType: 'CC',
  studyDate: '2024-04-15',
  aiPrediction: {
    label: 'Suspicious',
    confidence: 0.89,
  },
};

const CaseViewer = () => {
  const { caseId } = useParams();
  const [zoom, setZoom] = useState(100);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [feedback, setFeedback] = useState({
    decision: '',
    comment: '',
  });

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  const handleBrightnessChange = (event, newValue) => {
    setBrightness(newValue);
  };

  const handleContrastChange = (event, newValue) => {
    setContrast(newValue);
  };

  const handleFeedbackChange = (name, value) => {
    setFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitFeedback = () => {
    console.log('Submitting feedback:', feedback);
    // Add your feedback submission logic here
  };

  return (
    <Box sx={{ height: 'calc(100vh - 88px)' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Panel - DICOM Viewer */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
            }}
          >
            {/* Viewer Controls */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 2 }}>Zoom: {zoom}%</Typography>
                    <IconButton size="small" onClick={() => setZoom(zoom + 10)}>
                      <ZoomInIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => setZoom(zoom - 10)}>
                      <ZoomOutIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BrightnessIcon sx={{ mr: 1 }} />
                    <Slider
                      value={brightness}
                      onChange={handleBrightnessChange}
                      aria-label="Brightness"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ContrastIcon sx={{ mr: 1 }} />
                    <Slider
                      value={contrast}
                      onChange={handleContrastChange}
                      aria-label="Contrast"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* DICOM Image Display */}
            <Box
              sx={{
                flexGrow: 1,
                bgcolor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">
                DICOM Viewer will be integrated here
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Metadata and Controls */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
            {/* Patient Metadata */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Patient ID
                    </Typography>
                    <Typography>{mockCase.patientId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Accession #
                    </Typography>
                    <Typography>{mockCase.accessionNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Age
                    </Typography>
                    <Typography>{mockCase.age}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Laterality
                    </Typography>
                    <Typography>{mockCase.laterality}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      View Type
                    </Typography>
                    <Typography>{mockCase.viewType}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Study Date
                    </Typography>
                    <Typography>{mockCase.studyDate}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* AI Prediction */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Prediction
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={mockCase.aiPrediction.label}
                    color={mockCase.aiPrediction.label === 'Normal' ? 'success' : 'warning'}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {(mockCase.aiPrediction.confidence * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  fullWidth
                  onClick={() => {}}
                >
                  View Heatmap
                </Button>
              </CardContent>
            </Card>

            {/* Feedback Form */}
            <Card sx={{ flexGrow: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reviewer Feedback
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant={feedback.decision === 'accept' ? 'contained' : 'outlined'}
                      startIcon={<AcceptIcon />}
                      onClick={() => handleFeedbackChange('decision', 'accept')}
                      color="success"
                      fullWidth
                    >
                      Accept
                    </Button>
                    <Button
                      variant={feedback.decision === 'reject' ? 'contained' : 'outlined'}
                      startIcon={<RejectIcon />}
                      onClick={() => handleFeedbackChange('decision', 'reject')}
                      color="error"
                      fullWidth
                    >
                      Reject
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Comments"
                    value={feedback.comment}
                    onChange={(e) => handleFeedbackChange('comment', e.target.value)}
                  />
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.decision}
                >
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseViewer; 