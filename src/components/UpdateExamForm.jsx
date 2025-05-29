import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateExam, clearExamState, getExamById } from '../redux/slices/examSlice';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const UpdateExamForm = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedExam, loading, error, successMessage } = useSelector((state) => state.exam);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [file, setFile] = useState(null);

    // Fetch exam by id only once on mount
    useEffect(() => {
        dispatch(getExamById(id));
    }, [dispatch, id]);

    // Prefill form data when selectedExam changes
    useEffect(() => {
        if (selectedExam) {
            setFormData({
                name: selectedExam.name || '',
                description: selectedExam.description || '',
            });
        }
    }, [selectedExam]);

    // Toast notifications and clear state on unmount
    useEffect(() => {
        if (successMessage) toast.success(successMessage);
        if (error) toast.error(error);

        return () => {
            dispatch(clearExamState());
        };
    }, [successMessage, error, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (file) data.append('examImage', file);

        dispatch(updateExam({ id: id, data }));
    };

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header">
                    <h4>Update Exam</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Exam Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Current Image</label>
                            <br />
                            {selectedExam?.examImage ? (
                                <img
                                    src={`${process.env.REACT_APP_UPLOADS_URL}/uploads/${selectedExam.examImage}`}
                                    alt={selectedExam.name}
                                    style={{ width: '200px', height: '80px', objectFit: 'Contain', borderRadius: '6px' }}
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Change Image (optional)</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Exam'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateExamForm;
