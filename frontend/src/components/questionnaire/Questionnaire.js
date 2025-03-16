import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  keyframes,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  QuestionAnswer,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
} from '@mui/icons-material';
import {
  setAnswer,
  nextQuestion,
  previousQuestion,
  completeQuestionnaire,
  fetchQuestions,
  submitQuestionnaireThunk,
} from '../../store/questionnaireSlice';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../Layout/BaseLayout';

// Define keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function QuestionnaireContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questions, currentQuestion, answers, loading, error } = useSelector((state) => state.questionnaire);

  // Fetch questions from API when component mounts
  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  // If no questions are loaded yet, show loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#00E5FF', mb: 3 }} />
          <Typography variant="h5" sx={{ color: 'white' }}>
            Loading questions...
          </Typography>
        </Box>
      </Container>
    );
  }

  // If there was an error loading questions
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'rgba(255, 0, 0, 0.1)', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Error loading questions
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {error}. Using fallback questions instead.
          </Typography>
        </Box>
      </Container>
    );
  }

  // If no questions are available
  if (!questions || questions.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white' }}>
            No questions available. Please try again later.
          </Typography>
        </Box>
      </Container>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (event) => {
    dispatch(setAnswer({
      questionId: currentQuestionData.id,
      answer: event.target.value
    }));
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      // On the last question, submit the questionnaire
      dispatch(completeQuestionnaire());
      
      // Convert answers to the format expected by the API
      const formattedResponses = Object.entries(answers).map(([questionId, answerIndex]) => {
        // Find the question by ID
        const question = questions.find(q => q.id === parseInt(questionId));
        if (!question) return null;
        
        // Get the choice ID based on the selected answer index
        const choiceId = question.choices[parseInt(answerIndex)].id;
        
        return {
          question_id: parseInt(questionId),
          choice_id: choiceId
        };
      }).filter(response => response !== null);
      
      // Submit responses to the API
      dispatch(submitQuestionnaireThunk(formattedResponses));
      
      // Navigate to results page
      navigate('/results');
    } else {
      dispatch(nextQuestion());
    }
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, animation: `${fadeInUp} 1s ease-out` }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            color: '#00E5FF',
            fontWeight: 600,
            textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
            mb: 3,
            textAlign: 'center',
          }}
        >
          Career Assessment Questionnaire
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            mb: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #00E5FF, #2979FF)',
            }
          }} 
        />
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
          }}
        >
          Question {currentQuestion + 1} of {questions.length}
        </Typography>
      </Box>

      <Card 
        sx={{ 
          mb: 4, 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
          },
          animation: `${fadeInUp} 1s ease-out 0.2s both`,
        }}
      >
        <CardContent>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: '#ffffff',
              mb: 3,
              fontWeight: 500,
            }}
          >
            {currentQuestionData.text || currentQuestionData.question}
          </Typography>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={answers[currentQuestionData.id] || ''}
              onChange={handleAnswer}
            >
              {(currentQuestionData.choices || []).map((choice, index) => (
                <FormControlLabel
                  key={index}
                  value={index.toString()}
                  control={
                    <Radio 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: '#00E5FF',
                        }
                      }} 
                    />
                  }
                  label={
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {choice.text}
                    </Typography>
                  }
                  sx={{ 
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          animation: `${fadeInUp} 1s ease-out 0.4s both`,
        }}
      >
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          startIcon={<NavigateBefore />}
          sx={{ 
            color: '#00E5FF',
            borderColor: 'rgba(0, 229, 255, 0.5)',
            '&:hover': {
              borderColor: '#00E5FF',
              background: 'rgba(0, 229, 255, 0.1)',
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={currentQuestion === questions.length - 1 ? <CheckCircle /> : <NavigateNext />}
          disabled={!answers[currentQuestionData.id]}
          sx={{ 
            background: 'rgba(0, 229, 255, 0.9)',
            '&:hover': {
              background: 'rgba(0, 229, 255, 1)',
            },
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
}

function Questionnaire() {
  const { role } = useSelector((state) => state.auth);
  
  return (
    <BaseLayout role={role}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          minHeight: '100vh',
          width: '100%',
          margin: 0,
          padding: 0,
          background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'flex-start',
          color: 'white',
          overflowY: 'auto',
          zIndex: 0,
          paddingBottom: '100px',
        }}
      >
        <QuestionnaireContent />
      </Box>
    </BaseLayout>
  );
}

export default Questionnaire; 
