import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import { sendNotification } from './notificationSlice';

// 🔹 Submit doubt (for students)
export const submitDoubt = createAsyncThunk(
  'doubt/submitDoubt',
  async (doubtData, { rejectWithValue }) => {
    try {
      const res = await api.post('/submit-doubt', doubtData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Submit doubt failed' });
    }
  }
);

// 🔹 Get doubts by student
export const getDoubtsByStudent = createAsyncThunk(
  'doubt/getDoubtsByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/get/doubts/student/${studentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Fetch doubts failed' });
    }
  }
);

// 🔹 Get doubts by institute (for admin panel)
export const getDoubtsByInstitute = createAsyncThunk(
  'doubt/getDoubtsByInstitute',
  async (instituteId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/doubts/by-institute/${instituteId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Fetch institute doubts failed' });
    }
  }
);


export const answerDoubt = createAsyncThunk(
  'doubts/answerDoubt',
  async ({ doubtId, answer, answeredBy }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/answer/doubts/${doubtId}`, { answer, answeredBy });

      // 🔔 Send notification to student
      const doubt = res.data.data;
      dispatch(sendNotification({
        userId: doubt.studentId._id,          // ✅ Corrected field
        instituteId: doubt.instituteId,       // ✅ Already correct
        type: 'answered',
        title: 'Your doubt has been answered!',
        message: `Answer: ${answer}`
      }));

      return doubt;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const initialState = {
  doubts: [],
  loading: false,
  error: null,
  successMessage: null,
};

const doubtSlice = createSlice({
  name: 'doubt',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // ▶️ Submit doubt
    builder.addCase(submitDoubt.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitDoubt.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
      state.doubts.unshift(action.payload.data);
    });
    builder.addCase(submitDoubt.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || action.payload?.message;
    });

    // ▶️ Get doubts by student
    builder.addCase(getDoubtsByStudent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDoubtsByStudent.fulfilled, (state, action) => {
      state.loading = false;
      state.doubts = action.payload.data || [];
    });
    builder.addCase(getDoubtsByStudent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || action.payload?.message;
    });

    // ▶️ Get doubts by institute
    builder.addCase(getDoubtsByInstitute.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDoubtsByInstitute.fulfilled, (state, action) => {
      state.loading = false;
      state.doubts = action.payload.data || [];
    });
    builder.addCase(getDoubtsByInstitute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || action.payload?.message;
    });

    // ▶️ Answer doubt
    builder.addCase(answerDoubt.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(answerDoubt.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;

      // Replace the answered doubt in the list
      const index = state.doubts.findIndex(d => d._id === action.payload.data._id);
      if (index !== -1) {
        state.doubts[index] = action.payload.data;
      }
    });
    builder.addCase(answerDoubt.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || action.payload?.message;
    });
  },
});

export const { clearMessages } = doubtSlice.actions;
export default doubtSlice.reducer;
