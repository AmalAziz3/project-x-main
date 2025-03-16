import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

function ResultsHistory() {
  const navigate = useNavigate();
  const { pastResults } = useSelector((state) => state.questionnaire);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TimelineIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4">Results History</Typography>
      </Box>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {pastResults.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" align="center">
              No results history available yet.
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Take the questionnaire to see your results here.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/questionnaire')}
              >
                Take Questionnaire
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pastResults.map((result, index) => (
            <Grid item xs={12} key={result.id || index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {formatDate(result.date)}
                  </Typography>
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    Recommended Major: {result.recommendedMajor}
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {result.explanation}
                  </Typography>

                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Match Score: {result.matchScore}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={result.matchScore}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Typography variant="subtitle1" gutterBottom>
                    Alternative Majors:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {result.alternativeMajors.map((major, idx) => (
                      <Chip
                        key={idx}
                        label={`${major.name} - ${major.score}%`}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default ResultsHistory; 
