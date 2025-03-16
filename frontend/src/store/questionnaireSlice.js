import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getQuestions, submitQuestionnaire, getUserResults, getResultDetails } from '../services/questionnaireService';

// Async thunks for API calls
export const fetchQuestions = createAsyncThunk(
  'questionnaire/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      return await getQuestions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitQuestionnaireThunk = createAsyncThunk(
  'questionnaire/submitQuestionnaire',
  async (responses, { rejectWithValue }) => {
    try {
      return await submitQuestionnaire(responses);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserResults = createAsyncThunk(
  'questionnaire/fetchUserResults',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserResults();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResultDetails = createAsyncThunk(
  'questionnaire/fetchResultDetails',
  async (resultId, { rejectWithValue }) => {
    try {
      return await getResultDetails(resultId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fallback questions in case API is not available
const fallbackQuestions = [
  {
    id: 1,
    question: "How do you react when you see blood or injuries?",
    options: [
      { text: "I remain calm and want to help", majors: ["Medicine", "Nursing", "Emergency Medical Services", "Surgery"] },
      { text: "I can handle it but prefer not to deal with it", majors: ["Healthcare Administration", "Medical Technology", "Pharmacy", "Physical Therapy"] },
      { text: "I feel uncomfortable but can manage if necessary", majors: ["Health Sciences", "Public Health", "Nutrition", "Health Education"] },
      { text: "I avoid situations involving blood or injuries", majors: ["Psychology", "Health Informatics", "Medical Research", "Biomedical Engineering"] }
    ]
  },
  {
    id: 2,
    question: "How do you handle being responsible for important tasks?",
    options: [
      { text: "I enjoy taking charge of important responsibilities", majors: ["Business Administration", "Leadership Studies", "Project Management", "Entrepreneurship"] },
      { text: "I can handle responsibility when it's assigned to me", majors: ["Management", "Public Administration", "Operations Management", "Human Resources"] },
      { text: "I prefer sharing responsibility with others", majors: ["Collaborative Studies", "Team-Based Management", "Organizational Leadership", "Cooperative Education"] },
      { text: "I feel stressed when given too much responsibility", majors: ["Specialized Technical Fields", "Research Assistance", "Analytical Roles", "Support Services"] }
    ]
  },
  {
    id: 3,
    question: "In a group project, what role do you naturally take?",
    options: [
      { text: "I usually become the leader and organize the team", majors: ["Business Leadership", "Project Management", "Political Science", "Organizational Psychology"] },
      { text: "I contribute creative ideas and solutions", majors: ["Creative Writing", "Design", "Marketing", "Innovation Management"] },
      { text: "I focus on completing specific assigned tasks", majors: ["Engineering", "Computer Science", "Accounting", "Technical Specializations"] },
      { text: "I help maintain harmony and support team members", majors: ["Counseling", "Human Resources", "Social Work", "Communication Studies"] }
    ]
  },
  {
    id: 4,
    question: "How do you react in emergency situations?",
    options: [
      { text: "I stay calm and take action to help", majors: ["Emergency Management", "First Responder Training", "Crisis Intervention", "Military Leadership"] },
      { text: "I follow instructions and support others", majors: ["Nursing", "Emergency Medical Technician", "Safety Management", "Healthcare Support"] },
      { text: "I remain calm but prefer others to take the lead", majors: ["Medical Assistance", "Support Services", "Administrative Roles", "Coordination Positions"] },
      { text: "I find it difficult to think clearly under pressure", majors: ["Planned Care Roles", "Research", "Analysis", "Planning and Strategy"] }
    ]
  },
  {
    id: 5,
    question: "How do you feel about public speaking?",
    options: [
      { text: "I enjoy presenting and speaking in front of others", majors: ["Communications", "Public Relations", "Political Science", "Education"] },
      { text: "I can present effectively when prepared", majors: ["Business", "Marketing", "Sales", "Management"] },
      { text: "I get nervous but can manage with preparation", majors: ["Technical Fields", "Research", "Analysis", "Specialized Roles"] },
      { text: "I avoid public speaking whenever possible", majors: ["Computer Science", "Research", "Technical Writing", "Data Analysis"] }
    ]
  },
  {
    id: 6,
    question: "How do you approach solving complex problems?",
    options: [
      { text: "I enjoy analyzing data and finding patterns", majors: ["Data Science", "Statistics", "Economics", "Research Analysis"] },
      { text: "I like to break problems down into manageable steps", majors: ["Engineering", "Computer Science", "Mathematics", "Systems Analysis"] },
      { text: "I prefer creative and innovative approaches", majors: ["Design", "Architecture", "Marketing", "Entrepreneurship"] },
      { text: "I collaborate with others to find solutions", majors: ["Business Management", "Consulting", "Education", "Social Sciences"] }
    ]
  },
  {
    id: 7,
    question: "How do you feel about working with numbers and data?",
    options: [
      { text: "I love working with numbers and analyzing data", majors: ["Mathematics", "Statistics", "Finance", "Data Science"] },
      { text: "I can work with data when given clear methods", majors: ["Business Analytics", "Finance", "Accounting", "Research"] },
      { text: "I understand basic statistics but prefer other tasks", majors: ["Marketing", "Healthcare Administration", "Education", "Management"] },
      { text: "I find data analysis challenging and uninteresting", majors: ["Creative Arts", "Counseling", "Physical Education", "Hospitality"] }
    ]
  }
];

const initialState = {
  questions: fallbackQuestions,
  currentQuestion: 0,
  answers: {},
  isCompleted: false,
  results: null,
  resultDetails: null,
  loading: false,
  error: null
};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestion < state.questions.length - 1) {
        state.currentQuestion += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
      }
    },
    completeQuestionnaire: (state) => {
      state.isCompleted = true;
    },
    resetQuestionnaire: (state) => {
      state.currentQuestion = 0;
      state.answers = {};
      state.isCompleted = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Fallback to local questions if API fails
        state.questions = fallbackQuestions;
      })
      // Submit Questionnaire
      .addCase(submitQuestionnaireThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuestionnaireThunk.fulfilled, (state, action) => {
        state.results = action.payload;
        state.isCompleted = true;
        state.loading = false;
      })
      .addCase(submitQuestionnaireThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Results
      .addCase(fetchUserResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserResults.fulfilled, (state, action) => {
        state.results = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Result Details
      .addCase(fetchResultDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultDetails.fulfilled, (state, action) => {
        state.resultDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchResultDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setAnswer, 
  nextQuestion, 
  previousQuestion, 
  completeQuestionnaire, 
  resetQuestionnaire,
  clearError
} = questionnaireSlice.actions;

export default questionnaireSlice.reducer; 
