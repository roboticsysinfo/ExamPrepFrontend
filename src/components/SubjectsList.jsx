import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubject, getAllSubjects, getSubjectById, updateSubject } from '../redux/slices/subjectSlice';
import { getAllExams } from '../redux/slices/examSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const SubjectsList = () => {

    const dispatch = useDispatch();
    const { subjects, subject } = useSelector(state => state.subject);
    const { exams } = useSelector(state => state.exam);

    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({ id: '', name: '', exam: '' });

    useEffect(() => {
        dispatch(getAllSubjects());
        dispatch(getAllExams());

        const table = $('#dataTable').DataTable({ pageLength: 10 });
        return () => table.destroy(true);
    }, [dispatch]);

    const handleEditClick = async (id) => {
        const result = await dispatch(getSubjectById(id));
        if (result.meta.requestStatus === 'fulfilled') {
            const { _id, name, exam } = result.payload;
            setEditData({ id: _id, name, exam });
            setShowModal(true);
        }
    };

    const handleUpdate = () => {
        dispatch(updateSubject({ id: editData.id, name: editData.name, exam: editData.exam }));
        toast.success("Subject Update Successfully")
        setShowModal(false);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this subject?");
        if (confirmed) {
            dispatch(deleteSubject(id))
                .unwrap()
                .then(() => {
                    toast.success("Subject deleted successfully.");
                })
                .catch(() => {
                    toast.error("Failed to delete subject. Please try again.");
                });
        }
    };



    return (
        <>
            <div className="card basic-data-table">

                <div className="card-header d-flex  align-items-center justify-content-between">
                    <h5 className="card-title mb-0">All Subjects</h5>

                    <Link to="/create-subject" className='btn btn-primary'>
                        Create Subject
                    </Link>

                </div>

                <div className="card-body">
                    <table className="table bordered-table mb-0" id="dataTable">
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Name</th>
                                <th>Exam</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects?.map((subj, index) => (
                                <tr key={subj._id}>
                                    <td>{index + 1}</td>
                                    <td>{subj.name}</td>
                                    <td>{subj.exam?.name || '-'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditClick(subj._id)}
                                        >
                                            <Icon icon="lucide:edit" />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(subj._id)}
                                        >
                                            <Icon icon="lucide:trash-2" />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🧾 Edit Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: '#00000066' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content p-3">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Subject</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Subject Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Exam</label>
                                    <select
                                        className="form-control"
                                        value={editData.exam}
                                        onChange={(e) => setEditData({ ...editData, exam: e.target.value })}
                                    >
                                        <option value="">Select Exam</option>
                                        {exams.map((exam) => (
                                            <option key={exam._id} value={exam._id}>
                                                {exam.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={handleUpdate} className="btn btn-success">Update</button>
                                <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SubjectsList;
