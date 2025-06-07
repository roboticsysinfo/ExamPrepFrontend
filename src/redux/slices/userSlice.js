import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios'; 


// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  users: [],
  loading: false,
  error: null,
};


// 🔐 Login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || 'Login failed');
    }
  }
);


// 🚪 Logout
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  localStorage.removeItem('user');
  return null;
});


// 👤 Create User
export const createUser = createAsyncThunk(
  'user/createUser',
  async (data, thunkAPI) => {
    try {
      const res = await api.post('/auth/create-user', data);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || 'Create user failed');
    }
  }
);


// 📋 Get all users
export const getAllUsers = createAsyncThunk('user/getAllUsers', async (_, thunkAPI) => {
  try {
    const res = await api.get('/auth/users');
    return res.data.users;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to fetch users');
  }
});


// 🔍 Get single user
export const getUserById = createAsyncThunk('user/getUserById', async (id, thunkAPI) => {
  try {
    const res = await api.get(`/auth/users/${id}`);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'User not found');
  }
});


// ✏️ Update user
export const updateUser = createAsyncThunk('user/updateUser', async ({ id, data }, thunkAPI) => {
  try {
    const res = await api.put(`/auth/users/${id}`, data);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Update failed');
  }
});


// 🗑️ Delete user
export const deleteUser = createAsyncThunk('user/deleteUser', async (id, thunkAPI) => {
  try {
    await api.delete(`/auth/user-delete/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Delete failed');
  }
});


// 🧾 Assign role
export const assignRole = createAsyncThunk('user/assignRole', async ({ id, role }, thunkAPI) => {
  try {
    const res = await api.put(`/auth/user/assign-role/${id}`, { role });
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || 'Role assignment failed');
  }
});


// 📦 userSlice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.users = [];
      })

      // Get All Users
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })

      // Assign Role
      .addCase(assignRole.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) state.users[index].role = action.payload.role;
      })

      // Handle common errors
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default userSlice.reducer;
