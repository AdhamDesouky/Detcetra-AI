import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Alert,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [patientId, setPatientId] = useState("");
  const [accessionNumber, setAccessionNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => ({
        file,
        name: file.name,
        type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DICOM",
        status: "pending",
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/dicom": [".dcm"],
      "application/pdf": [".pdf"],
    },
  });

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!patientId || !accessionNumber) {
      setError("Please fill in both Patient ID and Accession Number");
      return;
    }

    if (files.length === 0) {
      setError("Please add files to upload");
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setProgress(i);
      }

      // Add your actual upload logic here

      setSuccess("Files uploaded successfully!");
      setFiles([]);
      setPatientId("");
      setAccessionNumber("");
    } catch (err) {
      setError("Error uploading files. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Files
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Upload Area */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <div {...getRootProps()} style={dropzoneStyle}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the DICOM files here...</p>
                  ) : (
                    <p>Drag 'n' drop DICOM files, or click to select</p>
                  )}
                  {status === "success" && <SuccessIcon color="success" />}
                  {status === "error" && <ErrorIcon color="error" />}
                </div>
              </Paper>
              <UploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag & Drop Files Here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click to select files
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Supported formats: DICOM (.dcm), PDF
              </Typography>
            </CardContent>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Selected Files
                </Typography>
                <List>
                  {files.map((file, index) => (
                    <ListItem key={index} divider={index < files.length - 1}>
                      <ListItemText
                        primary={file.name}
                        secondary={`Type: ${file.type}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveFile(index)}
                          disabled={uploading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Upload Details */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Details
              </Typography>
              <TextField
                fullWidth
                label="Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                margin="normal"
                required
                disabled={uploading}
              />
              <TextField
                fullWidth
                label="Accession Number"
                value={accessionNumber}
                onChange={(e) => setAccessionNumber(e.target.value)}
                margin="normal"
                required
                disabled={uploading}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}

              {uploading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={progress} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1 }}
                  >
                    Uploading... {progress}%
                  </Typography>
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                sx={{ mt: 3 }}
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Upload;
