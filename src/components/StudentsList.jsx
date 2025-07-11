import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteStudent, getStudentsByInstituteId } from '../redux/slices/studentSlice';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

const StudentsList = () => {
    const dispatch = useDispatch();
    const { instituteStudents, loading, error } = useSelector((state) => state.student);
    const { user } = useSelector((state) => state.auth.user);
    const instituteId = user?.instituteId;

    useEffect(() => {
        if (instituteId) {
            dispatch(getStudentsByInstituteId(instituteId));
        }
    }, [dispatch, instituteId]);

    useEffect(() => {
        if (instituteStudents.length > 0) {
            // Destroy existing table before initializing
            if ($.fn.DataTable.isDataTable('#dataTable')) {
                $('#dataTable').DataTable().destroy();
            }

            // Re-initialize DataTable with sorting on Join Date (column index 6)
            setTimeout(() => {
                $('#dataTable').DataTable({
                    pageLength: 10,
                    order: [[6, 'desc']], // Sort by Join Date descending
                });
            }, 0);
        }
    }, [instituteStudents]);

    if (loading) return <div className="text-center py-4"><Spinner variant='blue' /></div>;
    if (error) return <div className="text-danger text-center py-4">{error}</div>;

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete student?");
        if (confirmed) {
            dispatch(deleteStudent(id))
                .unwrap()
                .then(() => {
                    toast.success("Student deleted successfully.");
                    if (instituteId) {
                        dispatch(getStudentsByInstituteId(instituteId)); // Refresh list
                    }
                })
                .catch(() => {
                    toast.error("Failed to delete student. Please try again.");
                });
        }
    };

    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">Students</h5>
            </div>
            <div className="card-body">
                <table className="table bordered-table mb-0" id="dataTable">
                    <thead>
                        <tr>
                            <th>Reg. No.</th>
                            <th>Image</th>
                            <th>Student Name</th>
                            <th>Father Name</th>
                            <th>Mother Name</th>
                            <th>City</th>
                            <th>Join Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instituteStudents.map((student) => (
                            <tr key={student._id}>
                                <td>{student.registrationNumber}</td>
                                <td>
                                    <img
                                        src={
                                            student.profileImage
                                                ? `${process.env.REACT_APP_UPLOADS_URL}/${student.profileImage}`
                                                : "assets/images/user-list/user-default.png"
                                        }
                                        alt={student.name}
                                        width="40"
                                        height="40"
                                        className="radius-8"
                                        loading="lazy"
                                    />
                                </td>
                                <td>{student.name}</td>
                                <td>{student.fatherName}</td>
                                <td>{student.motherName}</td>
                                <td>{student.city}</td>
                                <td>{new Date(student.createdAt).toLocaleDateString('en-IN')}</td>
                                <td>
                                    <Link to={`/student/view/${student._id}`} className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center">
                                        <Icon icon="iconamoon:eye-light" />
                                    </Link>
                                    <Link to={`/student/edit/${student._id}`} className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center">
                                        <Icon icon="lucide:edit" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(student._id)}
                                        className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                    >
                                        <Icon icon="mingcute:delete-2-line" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentsList;
