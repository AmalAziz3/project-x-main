import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { getUserProfile, updateUserProfile } from '../services/userService';

// Async thunks for API calls
export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Attempting to register user with data:', {
        ...userData,
        password: '******' // Don't log actual password
      });
      return await registerUser(userData);
    } catch (error) {
      console.error('Registration error in thunk:', error);
      console.error('Error message:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserProfile();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      return await updateUserProfile(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initialize auth state from localStorage and check for token
export const initializeAuthThunk = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { isAuthenticated: false };
      }
      
      // If token exists, try to get user profile
      const result = await dispatch(getUserProfileThunk());
      
      if (getUserProfileThunk.fulfilled.match(result)) {
        const userData = result.payload;
        return { 
          isAuthenticated: true,
          user: {
            id: userData.id,
            email: userData.email,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            role: userData.role || 'student',
            gender: userData.gender || '',
            date_of_birth: userData.date_of_birth || '',
            gat_score: userData.gat_score || '',
            saath_score: userData.saath_score || '',
            high_school_gpa: userData.high_school_gpa || ''
          },
          role: userData.role || 'student'
        };
      } else {
        // If profile fetch fails, clear token and return not authenticated
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authState');
        return { isAuthenticated: false };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const loadAuthState = () => {
  try {
    const authState = localStorage.getItem('authState');
    return authState ? JSON.parse(authState) : {
      isAuthenticated: false,
      user: null,
      role: 'student',
      loading: false,
      error: null,
      verificationMessage: null,
    };
  } catch (err) {
    return {
      isAuthenticated: false,
      user: null,
      role: 'student',
      loading: false,
      error: null,
      verificationMessage: null,
    };
  }
};

const initialState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.role,
        loading: false,
        error: null,
      }));
    },
    logout: (state) => {
      logoutUser();
      state.isAuthenticated = false;
      state.user = null;
      state.role = 'student';
      state.loading = false;
      state.error = null;
      localStorage.removeItem('authState');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('authState', JSON.stringify(state));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Auth
      .addCase(initializeAuthThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuthThunk.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        if (action.payload.isAuthenticated) {
          state.user = action.payload.user;
          state.role = action.payload.role;
        } else {
          state.user = null;
          state.role = 'student';
        }
        state.loading = false;
        state.error = null;
        
        if (action.payload.isAuthenticated) {
          localStorage.setItem('authState', JSON.stringify({
            isAuthenticated: true,
            user: action.payload.user,
            role: action.payload.role,
            loading: false,
            error: null,
          }));
        }
      })
      .addCase(initializeAuthThunk.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.role = 'student';
        state.loading = false;
        state.error = action.payload;
        localStorage.removeItem('authState');
      })
      // Login
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        console.log('Login fulfilled with payload:', action.payload);
        const userData = action.payload.user;
        state.isAuthenticated = true;
        state.user = {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          role: userData.role || 'student',
          gender: userData.gender || '',
          date_of_birth: userData.date_of_birth || '',
          gat_score: userData.gat_score || '',
          saath_score: userData.saath_score || '',
          high_school_gpa: userData.high_school_gpa || ''
        };
        state.role = userData.role || 'student';
        state.loading = false;
        state.error = null;
        localStorage.setItem('authState', JSON.stringify({
          isAuthenticated: true,
          user: state.user,
          role: state.role,
          loading: false,
          error: null,
        }));
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        console.error('Login rejected with payload:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        const userData = action.payload.user;
        state.isAuthenticated = true;
        state.user = {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          role: userData.role || 'student',
          gender: userData.gender || '',
          date_of_birth: userData.date_of_birth || '',
          gat_score: userData.gat_score || '',
          saath_score: userData.saath_score || '',
          high_school_gpa: userData.high_school_gpa || ''
        };
        state.role = userData.role || 'student';
        state.loading = false;
        state.error = null;
        state.verificationMessage = action.payload.message || null;
        
        // Store verification code for development if available
        if (action.payload.dev_verification_code) {
          state.devVerificationCode = action.payload.dev_verification_code;
        }
        
        localStorage.setItem('authState', JSON.stringify({
          isAuthenticated: true,
          user: state.user,
          role: state.role,
          loading: false,
          error: null,
          verificationMessage: state.verificationMessage,
          devVerificationCode: state.devVerificationCode
        }));
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Profile
      .addCase(getUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfileThunk.fulfilled, (state, action) => {
        // Ensure we're not storing raw objects that might be directly rendered
        const userData = action.payload;
        state.user = {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          role: userData.role || 'student',
          gender: userData.gender || '',
          date_of_birth: userData.date_of_birth || '',
          gat_score: userData.gat_score || '',
          saath_score: userData.saath_score || '',
          high_school_gpa: userData.high_school_gpa || ''
        };
        state.role = userData.role || 'student';
        state.loading = false;
        state.error = null;
        localStorage.setItem('authState', JSON.stringify({
          ...state,
          user: state.user,
          role: state.role,
          loading: false,
          error: null,
        }));
      })
      .addCase(getUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Profile
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        const userData = action.payload;
        state.user = {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          role: userData.role || 'student',
          gender: userData.gender || '',
          date_of_birth: userData.date_of_birth || '',
          gat_score: userData.gat_score || '',
          saath_score: userData.saath_score || '',
          high_school_gpa: userData.high_school_gpa || ''
        };
        state.role = userData.role || state.role;
        state.loading = false;
        state.error = null;
        localStorage.setItem('authState', JSON.stringify({
          ...state,
          user: state.user,
          role: state.role,
          loading: false,
          error: null,
        }));
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer; 
