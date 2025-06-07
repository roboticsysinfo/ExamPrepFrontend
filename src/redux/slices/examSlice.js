import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// ✅ Create Exam
export const createExam = createAsyncThunk(
    'exam/createExam',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post('/create-exam', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Create failed');
        }
    }
);

// ✅ Update Exam
export const updateExam = createAsyncThunk(
    'exam/updateExam',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/update-exam/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Update failed');
        }
    }
);

// ✅ Delete Exam
export const deleteExam = createAsyncThunk(
    'exam/deleteExam',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/delete-exam/${id}`);
            return { id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Delete failed');
        }
    }
);

// ✅ Get Single Exam
export const getExamById = createAsyncThunk(
    'exam/getExamById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/single-exam/${id}`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Fetch failed');
        }
    }
);

// ✅ Get All Exams
export const getAllExams = createAsyncThunk(
    'exam/getAllExams',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/get/exams');
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Fetch failed');
        }
    }
);

// ✅ Get Exams by Institute ID
export const getExamsByInstituteId = createAsyncThunk(
    'exam/getExamsByInstituteId',
    async (instituteId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/exams/institute/${instituteId}`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Fetch failed');
        }
    }
);

// ✅ Initial State
const initialState = {
    exams: [],
    selectedExam: null,
    loading: false,
    error: null,
    successMessage: null,
};

// ✅ Slice
const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        clearExamState: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Create
            .addCase(createExam.pending, (state) => {
                state.loading = true;
            })
            .addCase(createExam.fulfilled, (state, action) => {
                state.loading = false;
                state.exams.unshift(action.payload);
                state.successMessage = 'Exam created successfully';
            })
            .addCase(createExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Update
            .addCase(updateExam.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateExam.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = state.exams.map((exam) =>
                    exam._id === action.payload._id ? action.payload : exam
                );
                state.successMessage = 'Exam updated successfully';
            })
            .addCase(updateExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Delete
            .addCase(deleteExam.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteExam.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = state.exams.filter((exam) => exam._id !== action.payload.id);
                state.successMessage = 'Exam deleted successfully';
            })
            .addCase(deleteExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Get One
            .addCase(getExamById.pending, (state) => {
                state.loading = true;
                state.selectedExam = null;
            })
            .addCase(getExamById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedExam = action.payload;
            })
            .addCase(getExamById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Get All
            .addCase(getAllExams.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllExams.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = action.payload;
            })
            .addCase(getAllExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Get by Institute
            .addCase(getExamsByInstituteId.pending, (state) => {
                state.loading = true;
            })
            .addCase(getExamsByInstituteId.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = action.payload;
            })
            .addCase(getExamsByInstituteId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearExamState } = examSlice.actions;
export default examSlice.reducer;
