import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';


// 🔹 1. Get notifications for user
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async ({ userId, instituteId }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/notifications/user/${userId}/institute/${instituteId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


// 🔹 2. Mark all as read
export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async ({ userId, instituteId }, { rejectWithValue }) => {
        try {
            await api.put(`/read-all/user/${userId}/institute/${instituteId}`);
            return { userId, instituteId };
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


// 🔹 3. Mark one as read
export const markOneNotificationAsRead = createAsyncThunk(
    'notifications/markOneAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            await api.put(`/read-one/${notificationId}`);
            return notificationId;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


// 🔹 4. Send to one student
export const sendNotification = createAsyncThunk(
    'notifications/sendNotification',
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post('/send-notification', data);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


// 🔹 5. Send to all students of institute
export const sendNotificationToAll = createAsyncThunk(
    'notifications/sendNotificationToAll',
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post('/send-notification-to-all', data);
            return res.data.message;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


// 🔹 6. Get all "doubt" type notifications for institute (for admin or public wall)
export const fetchDoubtNotifications = createAsyncThunk(
    'notifications/fetchDoubtNotifications',
    async (instituteId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/notifications/by-institute/${instituteId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);



// 🔹 Initial State
const initialState = {
    notifications: [],
    doubtNotifications: [],
    loading: false,
    error: null
};


// 🔹 Slice
const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotificationState: (state) => {
            state.notifications = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark all as read
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
            })

            // Mark one as read
            .addCase(markOneNotificationAsRead.fulfilled, (state, action) => {
                const id = action.payload;
                const index = state.notifications.findIndex((n) => n._id === id);
                if (index !== -1) {
                    state.notifications[index].isRead = true;
                }
            })

            // Send single notification
            .addCase(sendNotification.fulfilled, (state, action) => {
                state.notifications.unshift(action.payload);
            })

            // 🔹 Doubt notifications
            .addCase(fetchDoubtNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDoubtNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.doubtNotifications = action.payload;
            })
            .addCase(fetchDoubtNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Errors
            .addMatcher(
                (action) => action.type.startsWith('notifications') && action.type.endsWith('rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload || 'Something went wrong';
                }
            )



    }
});

export const { clearNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
