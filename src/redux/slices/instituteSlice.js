import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios'; // axios instance


// Create institute
export const createInstitute = createAsyncThunk(
  'institute/createInstitute',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/register-institute', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get all institutes
export const getAllInstitutes = createAsyncThunk(
  'institute/getAllInstitutes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/get/institutes');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get institute by ID
export const getInstituteById = createAsyncThunk(
  'institute/getInstituteById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/institute/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update institute
export const updateInstitute = createAsyncThunk(
  'institute/updateInstitute',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/institute/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Delete institute
export const deleteInstitute = createAsyncThunk(
  'institute/deleteInstitute',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/institute/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Initial state
const initialState = {
  institutes: [],
  selectedInstitute: null,
  loading: false,
  success: false,
  error: null,
  message: '',
};

const instituteSlice = createSlice({
  name: 'institute',
  initialState,
  reducers: {
    clearInstituteState: (state) => {
      state.success = false;
      state.error = null;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createInstitute.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInstitute.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.institutes.push(action.payload.data);
      })
      .addCase(createInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get All
      .addCase(getAllInstitutes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllInstitutes.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.institutes = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getAllInstitutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get by ID
      .addCase(getInstituteById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInstituteById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedInstitute = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getInstituteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update
      .addCase(updateInstitute.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInstitute.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.institutes = state.institutes.map((inst) =>
          inst._id === action.payload.data._id ? action.payload.data : inst
        );
      })
      .addCase(updateInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete
      .addCase(deleteInstitute.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInstitute.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.institutes = state.institutes.filter(
          (inst) => inst._id !== action.meta.arg
        );
      })
      .addCase(deleteInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearInstituteState } = instituteSlice.actions;
export default instituteSlice.reducer;
