
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios'; 


// Async Thunks


// 1. Upload previous question paper
export const uploadPreviousQuestionPaper = createAsyncThunk(
  'previousQuestionPaper/upload',
  async (formData, { rejectWithValue }) => {
    try {
      // formData should be a FormData instance with fields + file
      const response = await api.post('/upload/previous-question-paper', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data; // {success, message, data}
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false, message: err.message });
    }
  }
);


// 2. Get all previous question papers
export const fetchPreviousQuestionPapers = createAsyncThunk(
  'previousQuestionPaper/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/get/previouseQuestionPapers');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false, message: err.message });
    }
  }
);


// 3. Get papers by subject id
export const fetchPreviousQuestionPapersBySubject = createAsyncThunk(
  'previousQuestionPaper/fetchBySubject',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subject/previousQuestionPaper/${subjectId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false, message: err.message });
    }
  }
);


// 4. Delete previous question paper by id
export const deletePreviousQuestionPaper = createAsyncThunk(
  'previousQuestionPaper/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/delete/previousQuestionPaper/${id}`);
      return { ...response.data, deletedId: id };
    } catch (err) {
      return rejectWithValue(err.response?.data || { success: false, message: err.message });
    }
  }
);

// Slice

const initialState = {
  papers: [],
  loading: false,
  error: null,
  successMessage: null,
};

const previousQuestionPaperSlice = createSlice({
  name: 'previousQuestionPaper',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Upload
      .addCase(uploadPreviousQuestionPaper.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadPreviousQuestionPaper.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.papers.unshift(action.payload.data);
          state.successMessage = action.payload.message;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(uploadPreviousQuestionPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to upload paper';
      })

      // Fetch All
      .addCase(fetchPreviousQuestionPapers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchPreviousQuestionPapers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.papers = action.payload.data;
          state.successMessage = action.payload.message;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchPreviousQuestionPapers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch papers';
      })

      // Fetch By Subject
      .addCase(fetchPreviousQuestionPapersBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchPreviousQuestionPapersBySubject.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.papers = action.payload.data;
          state.successMessage = action.payload.message;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchPreviousQuestionPapersBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch papers by subject';
      })

      // Delete
      .addCase(deletePreviousQuestionPaper.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deletePreviousQuestionPaper.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.papers = state.papers.filter(p => p._id !== action.payload.deletedId);
          state.successMessage = action.payload.message;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(deletePreviousQuestionPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete paper';
      });
  },
});

export const { clearMessages } = previousQuestionPaperSlice.actions;
export default previousQuestionPaperSlice.reducer;
