import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
    fetchDoubtNotifications,
    markOneNotificationAsRead
} from '../redux/slices/notificationSlice';

const NotificationLayer = () => {
    const dispatch = useDispatch();
    const { doubtNotifications, loading } = useSelector(state => state.notifications);
    const { user } = useSelector(state => state.auth.user);
    const instituteId = user?.instituteId

    useEffect(() => {
        if (instituteId) {
            dispatch(fetchDoubtNotifications(instituteId));
        }
    }, [instituteId, dispatch]);

    const handleMarkAsRead = (notificationId) => {
        dispatch(markOneNotificationAsRead(notificationId));
    };

    return (
        
        <div className="card h-100 radius-12 overflow-hidden">
            <div className="card-body p-32">
                <h5 className="fw-bold mb-24">Notifications</h5>
                {loading && <p>Loading notifications...</p>}
                {!loading && doubtNotifications.length === 0 && <p>No notifications available.</p>}

                <div className="notification-list">
                    {doubtNotifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`border radius-12 p-16 mb-16 shadow-sm ${
                                notification.isRead ? 'bg-light' : 'bg-warning-100'
                            }`}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="mb-4 fw-semibold text-dark">
                                        {notification.title}
                                    </h6>
                                    <p className="text-muted mb-2">{notification.message}</p>
                                    <small className="text-secondary">
                                        {moment(notification.createdAt).fromNow()}
                                    </small>
                                </div>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationLayer;
