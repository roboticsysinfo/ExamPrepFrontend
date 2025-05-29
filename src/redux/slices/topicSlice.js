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
    const res = await api.put(`/${id}`, updatedData);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to update topic');
  }
});

// 🔹 Delete Topic
export const deleteTopic = createAsyncThunk('topics/delete', async (id, thunkAPI) => {
  try {
    const res = await api.delete(`/delete/topic/${id}`);
    return id; // Just return id to remove from local state
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

      // Get All
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

      // Create
      .addCase(createTopic.fulfilled, (state, action) => {
        state.topics.push(action.payload);
        state.error = null;
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
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

      // Delete
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
