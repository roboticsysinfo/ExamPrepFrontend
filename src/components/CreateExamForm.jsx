import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExam, clearExamState } from '../redux/slices/examSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateExamForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, successMessage } = useSelector((state) => state.exam);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [file, setFile] = useState(null);


    // Show toast messages on success/error
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            navigate('/exams')
        }
        if (error) {
            toast.error(error);
        }

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

        dispatch(createExam(data));
    };

    return (
        <div className="container mt-5">


            <div className="card shadow">
                <div className="card-header">
                    <h4>Create Exam</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Exam Name</label>
                            <input
                                type="name"
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
                            <label className="form-label">Upload Image (optional)</label>
                            <input
                                type="file"
                                name='examImage'
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Exam'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateExamForm;
