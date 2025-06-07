// src/redux/slices/studentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// 🔹 Register Student
export const registerStudent = createAsyncThunk(
    'student/register',
    async (studentData, { rejectWithValue }) => {
        try {
            const res = await api.post("/student/register", studentData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// 🔹 Get Student by ID
export const getStudentById = createAsyncThunk(
    'student/getById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/getstudentbyid/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// 🔹 Update Student
export const updateStudent = createAsyncThunk(
    'student/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/update/student/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// 🔹 Delete Student
export const deleteStudent = createAsyncThunk(
    'student/delete',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/delete/student/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// 🔹 Get all students
export const getAllStudents = createAsyncThunk(
    'students/getAllStudents',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/students');
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
);

// 🔹 Get Students by Institute ID
export const getStudentsByInstituteId = createAsyncThunk(
    'student/getByInstituteId',
    async (instituteId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/get-students-by-institute/${instituteId}`);
            return res.data.data; // Assuming data contains array of students
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
);

const studentSlice = createSlice({
    name: 'student',
    initialState: {
        students: [],
        instituteStudents: [],   // added to store students by institute
        student: null,
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearStudentMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload.data;
                state.successMessage = action.payload.message;
            })
            .addCase(registerStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Get by ID
            .addCase(getStudentById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStudentById.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload.data;
            })
            .addCase(getStudentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update
            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload.data;
                state.successMessage = action.payload.message;
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.student = null;
                state.successMessage = action.payload.message;
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Get All Students
            .addCase(getAllStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(getAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Students by Institute ID
            .addCase(getStudentsByInstituteId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentsByInstituteId.fulfilled, (state, action) => {
                state.loading = false;
                state.instituteStudents = action.payload;
            })
            .addCase(getStudentsByInstituteId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearStudentMessages } = studentSlice.actions;
export default studentSlice.reducer;
