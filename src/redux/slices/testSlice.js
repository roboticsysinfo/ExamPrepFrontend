import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// 🔹 Async Thunks

export const createTest = createAsyncThunk('test/createTest', async (testData, thunkAPI) => {
  try {
    const res = await api.post('/create-test', testData);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create test');
  }
});

export const fetchAllTests = createAsyncThunk('test/fetchAllTests', async (_, thunkAPI) => {
  try {
    const res = await api.get('/tests');
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch tests');
  }
});

export const fetchTestById = createAsyncThunk('test/fetchTestById', async (id, thunkAPI) => {
  try {
    const res = await api.get(`/single-test/${id}`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch test');
  }
});

export const updateTest = createAsyncThunk('test/updateTest', async ({ id, updatedData }, thunkAPI) => {
  try {
    const res = await api.put(`/update-test/${id}`, updatedData);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update test');
  }
});

export const deleteTest = createAsyncThunk('test/deleteTest', async (id, thunkAPI) => {
  try {
    const res = await api.delete(`/delete-test/${id}`);
    return { id, message: res.data.message };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete test');
  }
});


// 🔹 Optional: Fetch by Institute ID
export const fetchTestsByInstituteId = createAsyncThunk('test/fetchTestsByInstituteId', async (instituteId, thunkAPI) => {
  try {
    const res = await api.get(`/mock-tests/by-institute/${instituteId}`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch tests by institute');
  }
});

// 🔹 Slice

const testSlice = createSlice({
  name: 'test',
  initialState: {
    tests: [],
    currentTest: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearTestState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create
      .addCase(createTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests.push(action.payload);
        state.successMessage = 'Mock test created successfully';
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All
      .addCase(fetchAllTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchAllTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchTestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload;
      })
      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = state.tests.map((test) =>
          test._id === action.payload._id ? action.payload : test
        );
        state.successMessage = 'Mock test updated successfully';
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = state.tests.filter((test) => test._id !== action.payload.id);
        state.successMessage = action.payload.message;
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by Institute
      .addCase(fetchTestsByInstituteId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestsByInstituteId.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTestsByInstituteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTestState } = testSlice.actions;

export default testSlice.reducer;
