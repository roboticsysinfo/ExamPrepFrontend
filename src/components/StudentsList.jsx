import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteStudent, getAllStudents } from '../redux/slices/studentSlice';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

const StudentsList = () => {
    const dispatch = useDispatch();
    const { students, loading, error } = useSelector((state) => state.student);

    useEffect(() => {
        dispatch(getAllStudents());
    }, [dispatch]);

    useEffect(() => {
        if (students.length > 0) {
            const table = $('#dataTable').DataTable({
                pageLength: 10,
                destroy: true, // Important to allow reinitialization
            });

            return () => {
                table.destroy(true);
            };
        }
    }, [students]);

    if (loading) return <div className="text-center py-4"><Spinner variant='blue' /></div>;
    if (error) return <div className="text-danger text-center py-4">{error}</div>;


    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete student?");
        if (confirmed) {
            dispatch(deleteStudent(id))
                .unwrap()
                .then(() => {
                    toast.success("Student deleted successfully.");
                    dispatch(getAllStudents()); // Refresh list
                })
                .catch((err) => {
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
                        {students?.map((student) => (
                            <tr key={student._id}>
                                <td>{student.registrationNumber}</td>
                                <td>
                                    <img
                                        src={`${process.env.REACT_APP_UPLOADS_URL}/${student.profileImage}` || "assets/images/user-list/user-default.png"}
                                        alt={student.name}
                                        width="40"
                                        height="40"
                                        className="radius-8"
                                        loading='lazy'
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
