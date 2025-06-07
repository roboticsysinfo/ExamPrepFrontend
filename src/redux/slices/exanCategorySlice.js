import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../utils/axios";


// Get all categories
export const fetchExamCategories = createAsyncThunk(
  'examCategory/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/exam-categories`);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Get categories by Institute ID
export const fetchExamCategoriesByInstituteId = createAsyncThunk(
  'examCategory/fetchByInstituteId',
  async (instituteId, thunkAPI) => {
    try {
      const response = await api.get(`/exam-categories/institute/${instituteId}`);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Create category
export const createExamCategory = createAsyncThunk(
  'examCategory/create',
  async (formData, thunkAPI) => {
    try {
      const response = await api.post(
        `/create-exam-category`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Update category
export const updateExamCategory = createAsyncThunk(
  'examCategory/update',
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await api.put(
        `/update/examCategory/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Delete category
export const deleteExamCategory = createAsyncThunk(
  'examCategory/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/delete/examCategory/${id}`);  // added missing slash before id
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const examCategorySlice = createSlice({
  name: 'examCategory',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Get all categories
      .addCase(fetchExamCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchExamCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get categories by instituteId
      .addCase(fetchExamCategoriesByInstituteId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamCategoriesByInstituteId.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchExamCategoriesByInstituteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create category
      .addCase(createExamCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createExamCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update category
      .addCase(updateExamCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateExamCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete category
      .addCase(deleteExamCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExamCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      })
      .addCase(deleteExamCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default examCategorySlice.reducer;
