// src/redux/slices/adminMessageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/axios";
// ---------------- Async Thunks ----------------

// Create Message
export const createMessage = createAsyncThunk(
  "adminMessages/create",
  async ({ title, body }, { rejectWithValue }) => {
    try {
      const res = await api.post("/create-message", { title, body });
      return res.data.data; // returning created message
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get All Messages
export const getAllMessages = createAsyncThunk(
  "adminMessages/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/get-admin-messages");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get Message by ID
export const getMessageById = createAsyncThunk(
  "adminMessages/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/single-message${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update Message
export const updateMessage = createAsyncThunk(
  "adminMessages/update",
  async ({ id, title, body }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/update-message/${id}`, { title, body });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete Message
export const deleteMessage = createAsyncThunk(
  "adminMessages/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-message/${id}`);
      return id; // return deleted message id
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------- Slice ----------------
const adminMessageSlice = createSlice({
  name: "adminMessages",
  initialState: {
    messages: [],
    singleMessage: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Create Message
    builder
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.unshift(action.payload); // add new message on top
        state.success = true;
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All
    builder
      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get by ID
    builder
      .addCase(getMessageById.fulfilled, (state, action) => {
        state.singleMessage = action.payload;
      });

    // Update
    builder
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.messages = state.messages.map((msg) =>
          msg._id === action.payload._id ? action.payload : msg
        );
        state.success = true;
      });

    // Delete
    builder
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((msg) => msg._id !== action.payload);
        state.success = true;
      });
  },
});

export const { clearError, clearSuccess } = adminMessageSlice.actions;
export default adminMessageSlice.reducer;
