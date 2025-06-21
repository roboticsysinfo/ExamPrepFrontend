import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../redux/slices/userSlice';
import moment from 'moment/moment';

const UsersList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (users.length > 0) {
            const table = $('#dataTable').DataTable({ pageLength: 10 });
            return () => table.destroy(true);
        }
    }, [users]);


    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">All Users</h5>
            </div>
            <div className="card-body">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table bordered-table mb-0" id="dataTable">
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td className="d-flex align-items-center">
                                        <img
                                            src={user.avatar || '/assets/images/default-avatar.png'}
                                            alt="avatar"
                                            className="flex-shrink-0 me-12 radius-8"
                                            width={32}
                                            height={32}
                                        />
                                        <h6 className="text-md mb-0 fw-medium">{user.name}</h6>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{moment(user.createdAt).format('DD-MM-YYYY')}</td>
                                    <td>
                                        <Link
                                            to={`/admin/users/view/${user._id}`}
                                            className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                                        >
                                            <Icon icon="iconamoon:eye-light" />
                                        </Link>
                                        <Link
                                            to={`/admin/users/edit/${user._id}`}
                                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                        >
                                            <Icon icon="lucide:edit" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="w-32-px h-32-px bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                            onClick={() => alert(`Delete user: ${user._id}`)} // Replace with real handler
                                        >
                                            <Icon icon="mingcute:delete-2-line" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UsersList;
