import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPracticeTestsByInstitute, deletePracticeTest } from '../redux/slices/practiceTestSlice';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const PracticeTestsList = () => {

    const dispatch = useDispatch();
    const { practiceTests, loading, error, successMessage } = useSelector((state) => state.practiceTests);
    const { user } = useSelector((state) => state.auth.user);
    const instituteId = user?.instituteId

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTests, setFilteredTests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const testsPerPage = 10;

    useEffect(() => {
        if (instituteId) {
            dispatch(fetchPracticeTestsByInstitute(instituteId));
        }
    }, [dispatch, instituteId]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredTests(practiceTests);
            setCurrentPage(1);
            return;
        }

        const lowerSearch = searchTerm.toLowerCase();

        const filtered = practiceTests.filter((test) => {
            const examName = test.exam?.name?.toLowerCase() || '';
            const subjectName = test.subject?.name?.toLowerCase() || '';
            const topicName = test.topic?.name?.toLowerCase() || '';
            const title = test.title?.toLowerCase() || '';

            return (
                examName.includes(lowerSearch) ||
                subjectName.includes(lowerSearch) ||
                topicName.includes(lowerSearch) ||
                title.includes(lowerSearch)
            );
        });

        setFilteredTests(filtered);
        setCurrentPage(1);
    }, [searchTerm, practiceTests]);

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);

    const totalPages = Math.ceil(filteredTests.length / testsPerPage);

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this practice test?");
        if (confirmed) {
            dispatch(deletePracticeTest(id))
                .unwrap()
                .then(() => {
                    toast.success("Practice test deleted successfully.");
                })
                .catch(() => {
                    toast.error("Failed to delete practice test. Please try again.");
                });
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card basic-data-table">

            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Practice Tests List</h5>
                <Link to="/create-practice-test" className="btn btn-primary btn-sm">
                    + Create Practice Test
                </Link>
            </div>

            <div className="card-body">
                {loading && <Spinner variant="primary" />}

                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search by Title, Exam, Subject, Topic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="table-responsive">

                    <table className="table bordered-table mb-0" style={{ width: '100%' }}>

                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Title</th>
                                <th>Exam</th>
                                <th>Subject</th>
                                <th>Topic</th>
                                <th>Duration (min)</th>
                                <th>Total Marks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentTests.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No practice tests found.
                                    </td>
                                </tr>
                            )}
                            {currentTests.map((test, index) => (
                                <tr key={test._id}>
                                    <td>{indexOfFirstTest + index + 1}</td>
                                    <td>{test.title}</td>
                                    <td>{test.exam?.name || '-'}</td>
                                    <td>{test.subject?.name || '-'}</td>
                                    <td>
                                        {Array.isArray(test.topic)
                                            ? test.topic.map((t) => t.name).join(', ')
                                            : test.topic?.name || '-'}
                                    </td>

                                    <td>{test.duration || '-'}</td>
                                    <td>{test.totalMarks || '-'}</td>
                                    <td>
                                        <Link
                                            to={`/practice-test/edit/${test._id}`}
                                            className="btn btn-sm btn-success me-1"
                                            title="Edit"
                                        >
                                            <Icon icon="lucide:edit" width="18" />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(test._id)}
                                            className="btn btn-sm btn-danger"
                                            title="Delete"
                                        >
                                            <Icon icon="mingcute:delete-2-line" width="18" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <nav className="mt-3">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    <button className="page-link" onClick={() => paginate(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default PracticeTestsList;
