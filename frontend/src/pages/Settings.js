import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';

const Settings = ({ showToast }) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. John Smith',
    email: 'john.smith@example.com',
    role: 'Radiologist',
    department: 'Radiology',
    phone: '+1 234 567 8900',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    caseAssignments: true,
    weeklyReports: false,
    darkMode: true,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (name) => (event) => {
    setPreferences(prev => ({
      ...prev,
      [name]: event.target.checked
    }));
  };

  const handleSaveProfile = () => {
    // Add your save profile logic here
    setEditMode(false);
    showToast('Profile updated successfully', 'success');
    const handleSave = () => {
      // Save logic
      navigate('/dashboard');
    };
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset profile data to original values
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Profile Settings</Typography>
                {!editMode ? (
                  <IconButton onClick={() => setEditMode(true)} color="primary">
                    <EditIcon />
                  </IconButton>
                ) : (
                  <Box>
                    <IconButton onClick={handleSaveProfile} color="success" sx={{ mr: 1 }}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} color="error">
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  disabled={!editMode}
                >
                  Change Photo
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    value={profileData.role}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={profileData.department}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.emailNotifications}
                      onChange={handlePreferenceChange('emailNotifications')}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.caseAssignments}
                      onChange={handlePreferenceChange('caseAssignments')}
                    />
                  }
                  label="Case Assignment Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.weeklyReports}
                      onChange={handlePreferenceChange('weeklyReports')}
                    />
                  }
                  label="Weekly Performance Reports"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.darkMode}
                      onChange={handlePreferenceChange('darkMode')}
                    />
                  }
                  label="Dark Mode"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;