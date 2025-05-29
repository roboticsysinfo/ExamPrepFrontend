import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { deleteExam, getAllExams } from '../redux/slices/examSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ExamsList = () => {
    const dispatch = useDispatch();
    const { exams, loading } = useSelector((state) => state.exam);

    // Ref to track if DataTable is initialized
    const tableInitialized = useRef(false);


    useEffect(() => {
        dispatch(getAllExams());
        const table = $('#dataTable').DataTable({ pageLength: 10 });
        return () => table.destroy(true);
    }, [dispatch]);

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this exam?");
        if (confirmed) {
            dispatch(deleteExam(id))
                .unwrap()
                .then(() => {
                    toast.success("Exam deleted successfully.");
                    dispatch(getAllExams()); // Refresh the exam list
                    tableInitialized.current = false; // reset on delete
                })
                .catch(() => {
                    toast.error("Failed to delete exam. Please try again.");
                });
        }
    };


    return (
        <div className="card basic-data-table">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">All Exams</h5>
                <Link to="/create-exam" className="btn btn-primary">Create Exam</Link>
            </div>
            <div className="card-body">
                <table className="table bordered-table mb-0" id="dataTable">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Image</th>
                            <th>Exam Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams?.map((exam, index) => (
                            <tr key={exam._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img
                                        src={`${process.env.REACT_APP_UPLOADS_URL}/uploads/${exam.examImage}` || "https://placehold.co/600x400"}
                                        alt={exam.name}
                                        style={{ width: '100px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                                    />
                                </td>
                                <td>{exam.name}</td>
                                <td>{exam.description}</td>
                                <td>
                                    <Link to={`/exam/edit/${exam._id}`} className="btn btn-sm btn-success me-2">
                                        <Icon icon="lucide:edit" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(exam._id)}
                                        className="btn btn-sm btn-danger"
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

export default ExamsList;
