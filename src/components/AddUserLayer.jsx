import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllInstitutes } from '../redux/slices/instituteSlice';
import { createUser } from '../redux/slices/userSlice';

const AddUserLayer = () => {

    const dispatch = useDispatch();

    const { institutes } = useSelector((state) => state.institute);
    const { loading } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'super-admin',
        instituteId: '',
    });

    useEffect(() => {
        dispatch(getAllInstitutes());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'role') {
            setFormData((prev) => ({
                ...prev,
                role: value,
                instituteId: value === 'admin' || value === 'teacher' ? prev.instituteId : '',
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createUser(formData));
    };

    return (
        <div className='row justify-content-center'>
            <div className='col-lg-8 col-xs-12 col-sm-12'>
                <h4 className="mb-20">Create Admin for Registered Institute</h4>
                <hr />

                <div className="card p-5">
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-20">
                            <label className="form-label text-primary-light fw-semibold text-sm mb-8">
                                Name <span className="text-danger-600">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control radius-8"
                                placeholder="Enter Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-20">
                            <label className="form-label text-primary-light fw-semibold text-sm mb-8">
                                Email <span className="text-danger-600">*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control radius-8"
                                placeholder="Enter Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-20">
                            <label className="form-label text-primary-light fw-semibold text-sm mb-8">
                                Password <span className="text-danger-600">*</span>
                            </label>
                            <input
                                type="password"
                                className="form-control radius-8"
                                placeholder="Enter Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Role */}
                        <div className="mb-20">
                            <label className="form-label text-primary-light fw-semibold text-sm mb-8">
                                Role <span className="text-danger-600">*</span>
                            </label>
                            <select
                                className="form-control radius-8 form-select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="super-admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>

                        {/* Institute - only show if role is 'admin' or 'teacher' */}
                        {(formData.role === 'admin' || formData.role === 'teacher') && (
                            <div className="mb-20">
                                <label className="form-label text-primary-light fw-semibold text-sm mb-8">
                                    Institute <span className="text-danger-600">*</span>
                                </label>
                                <select
                                    className="form-control radius-8 form-select"
                                    name="instituteId"
                                    value={formData.instituteId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Institute
                                    </option>
                                    {institutes.map((inst) => (
                                        <option key={inst._id} value={inst._id}>
                                            {inst.name} ({inst.instituteRegNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="d-flex justify-content-end mt-30">
                            <button
                                type="submit"
                                className="btn btn-primary radius-8 px-30"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserLayer;
