import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getExamsByInstituteId,
} from '../redux/slices/examSlice';
import {
    getSubjectsByExamId,
} from '../redux/slices/subjectSlice';
import {
    deletePreviousQuestionPaper,
    fetchPreviousQuestionPapersBySubject,
} from '../redux/slices/previousQuestionPaperSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PreviousQuestionPapersList = () => {

    const dispatch = useDispatch();
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [searchText, setSearchText] = useState('');

    // Redux states
    const { user } = useSelector(state => state.auth.user);
    const { exams } = useSelector(state => state.exam);
    const { subjects } = useSelector(state => state.subject);

    const { papers, loading } = useSelector(state => state.previousQuestionPaper);
    const instituteId = user?.instituteId

    // Load exams on mount
    useEffect(() => {
        if (instituteId) {
            dispatch(getExamsByInstituteId(instituteId));
        }
    }, [instituteId, dispatch]);

    // Load subjects when exam changes
    useEffect(() => {
        if (selectedExam) {
            dispatch(getSubjectsByExamId(selectedExam));
        }
    }, [selectedExam, dispatch]);

    // Load papers when subject changes
    useEffect(() => {
        if (selectedSubject) {
            dispatch(fetchPreviousQuestionPapersBySubject(selectedSubject));
        }
    }, [selectedSubject, dispatch]);

    // Filtered papers by title
    const filteredPapers = papers.filter(paper =>
        paper.title?.toLowerCase().includes(searchText.toLowerCase())
    );


    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this question paper?");
        if (confirmed) {
            dispatch(deletePreviousQuestionPaper(id))
                .unwrap()
                .then(() => {
                    toast.success("Previous Paper deleted successfully.");
                })
                .catch(() => {
                    toast.error("Failed to delete Paper. Please try again.");
                });
        }
    };




    return (
        <div className="card p-3 mt-4">

            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Previouse Question Papers</h5>
                <Link to="/upload-question-paper" className="btn btn-primary">Upload Question Paper</Link>
            </div>

            <hr />

            <div className='card-body'>


                <div className="row mb-4">
                    <div className="col-md-4">
                        <label>Exam</label>
                        <select
                            className="form-select"
                            value={selectedExam}
                            onChange={(e) => {
                                setSelectedExam(e.target.value);
                                setSelectedSubject('');
                            }}
                        >
                            <option value="">Select Exam</option>
                            {exams?.map((exam) => (
                                <option key={exam._id} value={exam._id}>
                                    {exam.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label>Subject</label>
                        <select
                            className="form-select"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedExam}
                        >
                            <option value="">Select Subject</option>
                            {subjects?.map((subj) => (
                                <option key={subj._id} value={subj._id}>
                                    {subj.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label>Search by Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search title..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>

                <hr />

                {loading ? (
                    <p>Loading papers...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Title</th>
                                    <th>File</th>
                                    <th>Year</th>
                                    <th>Uploaded At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPapers.length > 0 ? (
                                    filteredPapers.map((paper) => (
                                        <tr key={paper._id}>
                                            <td>{paper.title}</td>
                                            <td>{paper.year}</td>
                                            <td>
                                                <a href={`${process.env.REACT_APP_UPLOADS_URL}/${paper.fileUrl}`} target="_blank" rel="noopener noreferrer">
                                                    View
                                                </a>
                                            </td>
                                            <td>{new Date(paper.uploadedAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(paper._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">No question papers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

        </div>
    );
};

export default PreviousQuestionPapersList;
