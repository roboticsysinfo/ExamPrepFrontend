import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';


// Async thunks
export const fetchAllQuestions = createAsyncThunk('questions/fetchAll', async () => {
    const response = await api.get('/all/questions');
    return response.data.data;
});

export const createQuestion = createAsyncThunk('questions/create', async (formData) => {
    const response = await api.post('/create-question', formData);
    return response.data.data;
});

export const updateQuestion = createAsyncThunk('questions/update', async ({ id, formData }) => {
    const response = await api.put(`/update-question/${id}`, formData);
    return response.data.data;
});

export const deleteQuestion = createAsyncThunk('questions/delete', async (id) => {
    await api.delete(`/delete-question/${id}`);
    return id;
});

export const fetchQuestionById = createAsyncThunk('questions/fetchOne', async (id) => {
    const response = await api.get(`/single-question/${id}`);
    return response.data.data;
});


// 🔷 Thunk: Bulk Create Questions
export const bulkCreateQuestions = createAsyncThunk(
    'questions/bulkCreate',
    async (questions, { rejectWithValue }) => {
        try {
            const response = await api.post('/create-bulk-questions', { questions });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);


export const fetchQuestionsByFilter = createAsyncThunk(
  'questions/fetchByFilter',
  async ({ exam, subject, topic }) => {
    const res = await api.get('/questions/filter', {
      params: { exam, subject, topic }
    });
    return res.data.data;
  }
);


// Initial state
const initialState = {
    questions: [],
    selectedQuestion: null,
    loading: false,
    error: null,
    success: false,
};


// Slice
const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        clearSelectedQuestion: (state) => {
            state.selectedQuestion = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchAllQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(fetchAllQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch by filter (new)
            .addCase(fetchQuestionsByFilter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestionsByFilter.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(fetchQuestionsByFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.questions.push(action.payload);
            })

            // Update
            .addCase(updateQuestion.fulfilled, (state, action) => {
                const index = state.questions.findIndex(q => q._id === action.payload._id);
                if (index !== -1) {
                    state.questions[index] = action.payload;
                }
            })

            // Delete
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.questions = state.questions.filter(q => q._id !== action.payload);
            })

            // Fetch one
            .addCase(fetchQuestionById.fulfilled, (state, action) => {
                state.selectedQuestion = action.payload;
            })

            // Bulk create
            .addCase(bulkCreateQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(bulkCreateQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.questions = action.payload;
            })
            .addCase(bulkCreateQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create questions';
                state.success = false;
            });
    },
});

export const { clearSelectedQuestion } = questionSlice.actions;
export default questionSlice.reducer;