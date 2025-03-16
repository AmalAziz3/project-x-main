import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAnnouncements, 
  createAnnouncement, 
  updateAnnouncement as updateAnnouncementAPI, 
  deleteAnnouncement as deleteAnnouncementAPI 
} from '../services/announcementService';

// Async thunks for API calls
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      return await getAnnouncements();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAnnouncementThunk = createAsyncThunk(
  'announcements/addAnnouncement',
  async (announcementData, { rejectWithValue }) => {
    try {
      return await createAnnouncement(announcementData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAnnouncementThunk = createAsyncThunk(
  'announcements/updateAnnouncement',
  async ({ id, announcementData }, { rejectWithValue }) => {
    try {
      return await updateAnnouncementAPI(id, announcementData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAnnouncementThunk = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async (id, { rejectWithValue }) => {
    try {
      await deleteAnnouncementAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Load announcements from localStorage (fallback for offline mode)
const loadAnnouncements = () => {
  try {
    const saved = localStorage.getItem('announcements');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading announcements:', error);
    return [];
  }
};

const initialState = {
  announcements: loadAnnouncements(),
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    dateRange: 'all',
  },
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addAnnouncement: (state, action) => {
      const newAnnouncement = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.announcements.unshift(newAnnouncement);
      localStorage.setItem('announcements', JSON.stringify(state.announcements));
    },
    updateAnnouncement: (state, action) => {
      const index = state.announcements.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.announcements[index] = {
          ...state.announcements[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('announcements', JSON.stringify(state.announcements));
      }
    },
    deleteAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(a => a.id !== action.payload);
      localStorage.setItem('announcements', JSON.stringify(state.announcements));
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.announcements = action.payload;
        state.isLoading = false;
        localStorage.setItem('announcements', JSON.stringify(action.payload));
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Announcement
      .addCase(addAnnouncementThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAnnouncementThunk.fulfilled, (state, action) => {
        state.announcements.unshift(action.payload);
        state.isLoading = false;
        localStorage.setItem('announcements', JSON.stringify(state.announcements));
      })
      .addCase(addAnnouncementThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Announcement
      .addCase(updateAnnouncementThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAnnouncementThunk.fulfilled, (state, action) => {
        const index = state.announcements.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.announcements[index] = action.payload;
        }
        state.isLoading = false;
        localStorage.setItem('announcements', JSON.stringify(state.announcements));
      })
      .addCase(updateAnnouncementThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Announcement
      .addCase(deleteAnnouncementThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncementThunk.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(a => a.id !== action.payload);
        state.isLoading = false;
        localStorage.setItem('announcements', JSON.stringify(state.announcements));
      })
      .addCase(deleteAnnouncementThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLoading,
  setError,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  setFilters,
  clearError,
} = announcementsSlice.actions;

// Selectors
export const selectFilteredAnnouncements = (state) => {
  const { announcements } = state.announcements;
  const { search, category, dateRange } = state.announcements.filters;
  
  return announcements.filter(announcement => {
    const matchesSearch = search === '' || 
      announcement.title.toLowerCase().includes(search.toLowerCase()) ||
      announcement.content.toLowerCase().includes(search.toLowerCase());
      
    const matchesCategory = category === 'all' || announcement.category === category;
    
    const date = new Date(announcement.createdAt);
    const now = new Date();
    const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
    
    const matchesDate = dateRange === 'all' ||
      (dateRange === 'week' && daysDiff <= 7) ||
      (dateRange === 'month' && daysDiff <= 30) ||
      (dateRange === 'year' && daysDiff <= 365);
      
    return matchesSearch && matchesCategory && matchesDate;
  });
};

export default announcementsSlice.reducer; 
