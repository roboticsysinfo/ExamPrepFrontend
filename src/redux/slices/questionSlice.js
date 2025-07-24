import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';


// Create Question
export const createQuestion = createAsyncThunk(
    'question/createQuestion',
    async (questionData, { rejectWithValue }) => {
        try {
            const res = await api.post(`/create-question`, questionData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


// Bulk Create Questions
export const bulkCreateQuestions = createAsyncThunk(
    'question/bulkCreateQuestions',
    async (questionsArray, { rejectWithValue }) => {
        try {
            const res = await api.post(`/create-bulk-questions`, { questions: questionsArray });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


// Update Question
export const updateQuestion = createAsyncThunk(
    'question/updateQuestion',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/update-question/${id}`, formData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Delete Question
export const deleteQuestion = createAsyncThunk(
    'question/deleteQuestion',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/delete-question/${id}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Get Question by ID
export const getQuestionById = createAsyncThunk(
    'question/getQuestionById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/single-question/${id}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Get All Questions
export const getAllQuestions = createAsyncThunk(
    'question/getAllQuestions',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`/all/questions`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Get Questions by Filter
export const getQuestionsByFilter = createAsyncThunk(
    'question/getQuestionsByFilter',
    async (filters, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await api.get(`/questions/filter?${params}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


// ✅ Get Questions by Institute ID
export const getQuestionsByInstituteId = createAsyncThunk(
    'question/getQuestionsByInstituteId',
    async (instituteId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/questions/institute/${instituteId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


// 🔷 Fetch with Filter (supports pagination)
export const fetchQuestionsByFilter = createAsyncThunk(
    'questions/fetchByFilter',
    async ({ exam, subject, topic, page = 1, limit = 50 }) => {
        const topicParam = Array.isArray(topic) ? topic.join(',') : topic;
        const res = await api.get('/questions/filter', {
            params: { exam, subject, topic: topicParam, page, limit }
        });

        return {
            questions: res.data.data,
            pagination: res.data.pagination || null
        };
    }
);



// Initial State
const initialState = {
    questions: [],
    selectedQuestion: null,
    loading: false,
    error: null,
    pagination: null // ⬅️ added for tracking page info
};

const questionSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        clearSelectedQuestion: (state) => {
            state.selectedQuestion = null;
        },
        clearQuestionError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // Create
            .addCase(createQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.questions.push(action.payload);
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Bulk Create
            .addCase(bulkCreateQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bulkCreateQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = [...state.questions, ...action.payload];
            })
            .addCase(bulkCreateQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.questions.findIndex(q => q._id === action.payload._id);
                if (index !== -1) state.questions[index] = action.payload;
            })
            .addCase(updateQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = state.questions.filter(q => q._id !== action.payload._id);
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get By ID
            .addCase(getQuestionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuestionById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedQuestion = action.payload;
            })
            .addCase(getQuestionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All
            .addCase(getAllQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(getAllQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get by Filter
            .addCase(getQuestionsByFilter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuestionsByFilter.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(getQuestionsByFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Get by Institute ID
            .addCase(getQuestionsByInstituteId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuestionsByInstituteId.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(getQuestionsByInstituteId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // 🔷 Fetch by filter (with pagination)
            .addCase(fetchQuestionsByFilter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchQuestionsByFilter.fulfilled, (state, action) => {
                state.loading = false;

                const newQuestions = action.payload.questions;
                const existingIds = new Set(state.questions.map(q => q._id));

                const filteredNew = newQuestions.filter(q => !existingIds.has(q._id));

                if (state.pagination?.page && action.payload.pagination?.page > 1) {
                    state.questions = [...state.questions, ...filteredNew];
                } else {
                    state.questions = filteredNew;
                }

                state.pagination = action.payload.pagination;
            })


            .addCase(fetchQuestionsByFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


    }
});

export const { clearSelectedQuestion, clearQuestionError } = questionSlice.actions;

export default questionSlice.reducer;
