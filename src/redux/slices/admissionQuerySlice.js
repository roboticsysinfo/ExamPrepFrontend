import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios'; 


// 🎯 1. Send Admission Query (public use)
export const sendAdmissionQuery = createAsyncThunk(
  'admissionQuery/sendAdmissionQuery',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/send-admission-query', formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send query');
    }
  }
);

// 🎯 2. Fetch All Admission Queries (admin panel)
export const fetchAdmissionQueries = createAsyncThunk(
  'admissionQuery/fetchAdmissionQueries',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/get-admission-query');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch queries');
    }
  }
);

// 🎯 3. Fetch Admission Queries by Institute ID
export const fetchQueriesByInstituteId = createAsyncThunk(
  'admissionQuery/fetchQueriesByInstituteId',
  async (instituteId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/getAdmissionQueriesByInstituteId/${instituteId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch institute queries');
    }
  }
);

// 🎯 4. Delete Admission Query by ID
export const deleteAdmissionQuery = createAsyncThunk(
  'admissionQuery/deleteAdmissionQuery',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete/admission-queries/${id}`);
      return id;  // return deleted query ID for updating state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete query');
    }
  }
);

// 🧾 Initial State
const initialState = {
  admissionQueries: [],
  loading: false,
  error: null,
  successMessage: null,
};

// 🧩 Slice
const admissionQuerySlice = createSlice({
  name: 'admissionQuery',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Send Admission Query
      .addCase(sendAdmissionQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(sendAdmissionQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Admission query submitted successfully';
      })
      .addCase(sendAdmissionQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch All Queries
      .addCase(fetchAdmissionQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissionQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.admissionQueries = action.payload;
      })
      .addCase(fetchAdmissionQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Queries by Institute ID
      .addCase(fetchQueriesByInstituteId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueriesByInstituteId.fulfilled, (state, action) => {
        state.loading = false;
        state.admissionQueries = action.payload;
      })
      .addCase(fetchQueriesByInstituteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Delete Admission Query
      .addCase(deleteAdmissionQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAdmissionQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Admission query deleted successfully';
        state.admissionQueries = state.admissionQueries.filter(
          (query) => query._id !== action.payload
        );
      })
      .addCase(deleteAdmissionQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = admissionQuerySlice.actions;

export default admissionQuerySlice.reducer;
