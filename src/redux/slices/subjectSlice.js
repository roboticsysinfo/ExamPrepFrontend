// src/redux/slices/subjectSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// 🔁 Async Thunks

export const createSubject = createAsyncThunk(
  'subject/create',
  async ({ name, exam, instituteId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/create-subject', { name, exam, instituteId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Something went wrong');
    }
  }
);

export const getAllSubjects = createAsyncThunk(
  'subject/getAll',
  async (examId = '', { rejectWithValue }) => {
    try {
      const query = examId ? `?examId=${examId}` : '';
      const response = await api.get(`/subjects${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch subjects');
    }
  }
);

export const getSubjectsByInstituteId = createAsyncThunk(
  'subject/getByInstitute',
  async (instituteId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subjects/by-institute/${instituteId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch by institute');
    }
  }
);

// ** Naya thunk for fetching subjects by exam ID **
export const getSubjectsByExamId = createAsyncThunk(
  'subject/getByExamId',
  async (examId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subjects/by-exam/${examId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch subjects by exam');
    }
  }
);

export const getSubjectById = createAsyncThunk(
  'subject/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/getsubjectbyid/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Subject not found');
    }
  }
);

export const updateSubject = createAsyncThunk(
  'subject/update',
  async ({ id, name, exam, instituteId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/update/subject/${id}`, { name, exam, instituteId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Update failed');
    }
  }
);

export const deleteSubject = createAsyncThunk(
  'subject/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete/subject/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Delete failed');
    }
  }
);

// 🧠 Slice
const subjectSlice = createSlice({
  name: 'subject',
  initialState: {
    subjects: [],
    subject: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSubjectState: (state) => {
      state.subject = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createSubject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects.push(action.payload);
        state.successMessage = 'Subject created successfully';
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllSubjects
      .addCase(getAllSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(getAllSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getSubjectsByInstituteId
      .addCase(getSubjectsByInstituteId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubjectsByInstituteId.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(getSubjectsByInstituteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getSubjectsByExamId - naya added part
      .addCase(getSubjectsByExamId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubjectsByExamId.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(getSubjectsByExamId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getSubjectById
      .addCase(getSubjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.subject = action.payload;
      })
      .addCase(getSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateSubject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subjects.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        state.successMessage = 'Subject updated successfully';
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteSubject
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.filter((s) => s._id !== action.payload);
        state.successMessage = 'Subject deleted successfully';
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubjectState } = subjectSlice.actions;
export default subjectSlice.reducer;
