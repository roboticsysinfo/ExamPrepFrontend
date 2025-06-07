// src/features/practiceTests/practiceTestsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios'; // axios instance with auth interceptor

// Async thunks for API calls

// 1. Get all practice tests
export const fetchAllPracticeTests = createAsyncThunk(
  'practiceTests/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/practice-tests');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2. Get tests by institute ID
export const fetchPracticeTestsByInstitute = createAsyncThunk(
  'practiceTests/fetchByInstitute',
  async (instituteId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/practice-test/by-institute/${instituteId}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 3. Get test by ID
export const fetchPracticeTestById = createAsyncThunk(
  'practiceTests/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/practice-tests/${id}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 4. Create a new practice test
export const createPracticeTest = createAsyncThunk(
  'practiceTests/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/create-practice-test', data);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 5. Update practice test by ID
export const updatePracticeTest = createAsyncThunk(
  'practiceTests/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/practice-tests/update/${id}`, updatedData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 6. Delete practice test by ID
export const deletePracticeTest = createAsyncThunk(
  'practiceTests/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-practice-test/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Initial state
const initialState = {
  practiceTests: [],
  currentTest: null,
  loading: false,
  error: null,
  successMessage: null,
};

const practiceTestsSlice = createSlice({
  name: 'practiceTests',
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.currentTest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllPracticeTests
      .addCase(fetchAllPracticeTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPracticeTests.fulfilled, (state, action) => {
        state.loading = false;
        state.practiceTests = action.payload;
      })
      .addCase(fetchAllPracticeTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchPracticeTestsByInstitute
      .addCase(fetchPracticeTestsByInstitute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPracticeTestsByInstitute.fulfilled, (state, action) => {
        state.loading = false;
        state.practiceTests = action.payload;
      })
      .addCase(fetchPracticeTestsByInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchPracticeTestById
      .addCase(fetchPracticeTestById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentTest = null;
      })
      .addCase(fetchPracticeTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload;
      })
      .addCase(fetchPracticeTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createPracticeTest
      .addCase(createPracticeTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createPracticeTest.fulfilled, (state, action) => {
        state.loading = false;
        state.practiceTests.unshift(action.payload);
        state.successMessage = 'Practice test created successfully';
      })
      .addCase(createPracticeTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updatePracticeTest
      .addCase(updatePracticeTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePracticeTest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Practice test updated successfully';
        // update the item in list
        const index = state.practiceTests.findIndex(test => test._id === action.payload._id);
        if (index !== -1) {
          state.practiceTests[index] = action.payload;
        }
        // Also update currentTest if open
        if(state.currentTest?._id === action.payload._id) {
          state.currentTest = action.payload;
        }
      })
      .addCase(updatePracticeTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deletePracticeTest
      .addCase(deletePracticeTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deletePracticeTest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Practice test deleted successfully';
        state.practiceTests = state.practiceTests.filter(test => test._id !== action.payload);
        if(state.currentTest?._id === action.payload) {
          state.currentTest = null;
        }
      })
      .addCase(deletePracticeTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = practiceTestsSlice.actions;
export default practiceTestsSlice.reducer;
