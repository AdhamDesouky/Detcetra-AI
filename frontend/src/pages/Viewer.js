import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  TextField
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Flip,
  Save,
  ArrowBack,
  Search
} from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

// Dummy case data
const dummyCaseData = {
  1: {
    patientId: 'P001',
    accessionNumber: 'ACC001',
    viewType: 'CC',
    laterality: 'Left',
    aiPrediction: 'Normal',
    status: 'Pending',
    modality: 'Mammo',
    imageUrl: 'https://via.placeholder.com/800x1000',
    patientInfo: {
      age: 45,
      gender: 'Female',
      history: 'No significant family history',
      lastScreening: '2023-01-15'
    }
  },
  2: {
    patientId: 'P002',
    accessionNumber: 'ACC002',
    viewType: 'MLO',
    laterality: 'Right',
    aiPrediction: 'Rupture',
    status: 'Reviewed',
    modality: 'Mammo',
    imageUrl: 'https://via.placeholder.com/800x1000',
    patientInfo: {
      age: 52,
      gender: 'Female',
      history: 'Previous benign biopsy',
      lastScreening: '2022-11-20'
    }
  },
  3: {
    patientId: 'P003',
    accessionNumber: 'ACC003',
    viewType: 'CC',
    laterality: 'Right',
    aiPrediction: 'Normal',
    status: 'Pending',
    modality: 'Mammo',
    imageUrl: 'https://via.placeholder.com/800x1000',
    patientInfo: {
      age: 38,
      gender: 'Female',
      history: 'High-risk screening',
      lastScreening: '2023-02-10'
    }
  },
  4: {
    patientId: 'P004',
    accessionNumber: 'ACC004',
    viewType: 'MLO',
    laterality: 'Left',
    aiPrediction: 'Rupture',
    status: 'Pending',
    modality: 'Mammo',
    imageUrl: 'https://via.placeholder.com/800x1000',
    patientInfo: {
      age: 60,
      gender: 'Female',
      history: 'Previous rupture',
      lastScreening: '2022-09-05'
    }
  },
  5: {
    patientId: 'P005',
    accessionNumber: 'ACC005',
    viewType: 'CC',
    laterality: 'Left',
    aiPrediction: 'Normal',
    status: 'Reviewed',
    modality: 'Mammo',
    imageUrl: 'https://via.placeholder.com/800x1000',
    patientInfo: {
      age: 48,
      gender: 'Female',
      history: 'Regular screening',
      lastScreening: '2023-03-01'
    }
  },
  6: {
    patientId: 'P006',
    accessionNumber: 'ACC006',
    viewType: 'MLO',
    laterality: 'Right',
    aiPrediction: 'Rupture',
    status: 'Pending',
    modality: 'Mammo',
    imageUrl: 'https://via.placeholder.com/800x1000',
    patientInfo: {
      age: 55,
      gender: 'Female',
      history: 'BRCA1 positive',
      lastScreening: '2022-12-15'
    }
  },
  7: {
    patientId: 'P007',
    accessionNumber: 'ACC007',
    viewType: 'CC',
    laterality: 'Right',
    aiPrediction: 'Normal',
    status: 'Pending',
    modality: 'Mammo',
    imageUrl: 'https://via.placeholder.com/800x1000',
    patientInfo: {
      age: 42,
      gender: 'Female',
      history: 'Dense breast tissue',
      lastScreening: '2023-01-30'
    }
  },
  8: {
    patientId: 'P008',
    accessionNumber: 'ACC008',
    viewType: 'MLO',
    laterality: 'Left',
    aiPrediction: 'Rupture',
    status: 'Reviewed',
    modality: 'Mammo',
    imageUrl: 'https://via.placeholder.com/800x1000',
    patientInfo: {
      age: 50,
      gender: 'Female',
      history: 'Previous rupture',
      lastScreening: '2022-10-20'
    }
  }
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  transition: 'all 0.2s ease-in-out',
}));

const Viewer = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState(false);
  const [annotation, setAnnotation] = useState('');
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    if (caseId) {
      const fetchCaseData = async () => {
        try {
          setLoading(true);
          // In a real app, you would fetch from your backend
          const data = dummyCaseData[caseId];
          if (data) {
            setCaseData(data);
            setAnnotation(data.aiPrediction || '');
          } else {
            setError('Case not found');
          }
        } catch (err) {
          setError('Failed to load case data');
          console.error('Error fetching case:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchCaseData();
    }
  }, [caseId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId) {
      navigate(`/viewer/${searchId}`);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleFlip = () => {
    setFlip(prev => !prev);
  };

  const handleSave = async () => {
    try {
      // In a real app, you would save to your backend
      console.log('Saving annotation:', annotation);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving annotation:', err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!caseId) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <StyledPaper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontWeight: 500,
              color: '#1976d2',
              mb: 3
            }}
          >
            Search for a Case
          </Typography>
          <form onSubmit={handleSearch}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Case ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter case ID (1-8)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
              <StyledButton
                type="submit"
                variant="contained"
                startIcon={<Search />}
                sx={{ minWidth: 120 }}
              >
                Search
              </StyledButton>
            </Box>
          </form>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Available case IDs: 1-8
          </Typography>
        </StyledPaper>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <StyledButton 
        startIcon={<ArrowBack />} 
        onClick={handleBack}
        sx={{ 
          mb: 3,
          color: '#1976d2',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          }
        }}
      >
        Back to Dashboard
      </StyledButton>

      <Grid container spacing={3}>
        {/* Case Information */}
        <Grid item xs={12}>
          <StyledPaper sx={{ p: 3 }}>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 500,
                color: '#1976d2',
                mb: 2
              }}
            >
              Case Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Patient ID
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ fontWeight: 500 }}
                >
                  {caseData.patientId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Accession Number
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ fontWeight: 500 }}
                >
                  {caseData.accessionNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  View Type
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ fontWeight: 500 }}
                >
                  {caseData.viewType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Laterality
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ fontWeight: 500 }}
                >
                  {caseData.laterality}
                </Typography>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        {/* Image Viewer */}
        <Grid item xs={12} md={8}>
          <StyledPaper sx={{ p: 3 }}>
            <Box sx={{ 
              position: 'relative', 
              overflow: 'hidden',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              mb: 2
            }}>
              <img
                src={caseData.imageUrl}
                alt={`${caseData.viewType} ${caseData.laterality}`}
                style={{
                  width: '100%',
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}`,
                  transition: 'transform 0.3s ease',
                  display: 'block'
                }}
              />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1,
              flexWrap: 'wrap'
            }}>
              <IconButton 
                onClick={handleZoomIn}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ZoomIn />
              </IconButton>
              <IconButton 
                onClick={handleZoomOut}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ZoomOut />
              </IconButton>
              <IconButton 
                onClick={handleRotateLeft}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <RotateLeft />
              </IconButton>
              <IconButton 
                onClick={handleRotateRight}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <RotateRight />
              </IconButton>
              <IconButton 
                onClick={handleFlip}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Flip />
              </IconButton>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Controls and Annotations */}
        <Grid item xs={12} md={4}>
          <StyledPaper sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 500,
                color: '#1976d2',
                mb: 2
              }}
            >
              Controls
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography 
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Zoom: {zoom}%
              </Typography>
              <Slider
                value={zoom}
                onChange={(e, newValue) => setZoom(newValue)}
                min={50}
                max={200}
                step={25}
                sx={{ 
                  width: '100%',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                    },
                  }
                }}
              />
            </Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Annotation</InputLabel>
              <Select
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                label="Annotation"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Rupture">Rupture</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <StyledButton
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              fullWidth
              size="large"
              sx={{ 
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Save and Return to Dashboard
            </StyledButton>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Viewer; 