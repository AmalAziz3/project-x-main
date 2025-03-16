import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import questionnaireReducer from './questionnaireSlice';
import announcementsReducer from './announcementsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questionnaire: questionnaireReducer,
    announcements: announcementsReducer,
  },
});

export default store; 
