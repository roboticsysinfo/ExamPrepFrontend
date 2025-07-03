import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// 🔹 Get All Topics
export const getAllTopics = createAsyncThunk('topics/getAll', async (_, thunkAPI) => {
  try {
    const res = await api.get('/topics');
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to fetch topics');
  }
});

// 🔹 Get Topics by Institute ID
export const getTopicsByInstituteId = createAsyncThunk('topics/getByInstituteId', async (instituteId, thunkAPI) => {
  try {
    const res = await api.get(`/topics/institute/${instituteId}`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to fetch topics by institute');
  }
});

// 🔹 Get Topics by Subject ID
export const getTopicsBySubjectId = createAsyncThunk('topics/getBySubjectId', async (subjectId, thunkAPI) => {
  try {
    const res = await api.get(`/topics/by-subject/${subjectId}`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch topics by subject');
  }
});

// 🔹 Create Topic
export const createTopic = createAsyncThunk('topics/create', async (topicData, thunkAPI) => {
  try {
    const res = await api.post('/create-topic', topicData);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to create topic');
  }
});

// 🔹 Update Topic
export const updateTopic = createAsyncThunk('topics/update', async ({ id, updatedData }, thunkAPI) => {
  try {
    const res = await api.put(`/update/topic/${id}`, updatedData);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to update topic');
  }
});

// 🔹 Delete Topic
export const deleteTopic = createAsyncThunk('topics/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/delete/topic/${id}`);
    return id; // Return the deleted topic ID
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to delete topic');
  }
});

const topicSlice = createSlice({
  name: 'topics',
  initialState: {
    topics: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Get All Topics
      .addCase(getAllTopics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
        state.error = null;
      })
      .addCase(getAllTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get Topics by Institute ID
      .addCase(getTopicsByInstituteId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTopicsByInstituteId.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
        state.error = null;
      })
      .addCase(getTopicsByInstituteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get Topics by Subject ID
      .addCase(getTopicsBySubjectId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTopicsBySubjectId.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
        state.error = null;
      })
      .addCase(getTopicsBySubjectId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Create Topic
      .addCase(createTopic.fulfilled, (state, action) => {
        state.topics.push(action.payload);
        state.error = null;
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Update Topic
      .addCase(updateTopic.fulfilled, (state, action) => {
        const index = state.topics.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTopic.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Delete Topic
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topics = state.topics.filter((t) => t._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default topicSlice.reducer;
