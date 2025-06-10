import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const StudentUpdateForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        motherName: '',
        phoneNumber: '',
        email: '',
        address: '',
        state: '',
        city: '',
        village: '',
        dob: '',
        gender: '',
        profileImage: null,
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await api.get(`/getstudentbyid/${id}`);
                const student = res.data.data;
                setFormData({ ...student, profileImage: null }); // image null
            } catch (err) {
                toast.error('Failed to fetch student data');
            }
        };

        if (id) fetchStudent();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setFormData({ ...formData, profileImage: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (let key in formData) {
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            }

            await api.put(`/update/student/${id}`, data);
            toast.success('Student updated successfully!');
            navigate('/students');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Update Student</h5>
                </div>
                <div className="card-body">
                    <form className="row gy-3" onSubmit={handleSubmit}>
                        {[
                            { label: 'Student Name', name: 'name' },
                            { label: 'Father Name', name: 'fatherName' },
                            { label: 'Mother Name', name: 'motherName' },
                            { label: 'Date of Birth', name: 'dob', type: 'date' },
                            { label: 'Email', name: 'email', type: 'email' },
                            { label: 'Phone Number', name: 'phoneNumber', type: 'tel' },
                            { label: 'State', name: 'state' },
                            { label: 'City', name: 'city' }
                        ].map(({ label, name, type = 'text' }, index) => (
                            <div className="col-md-6" key={index}>
                                <label className="form-label">{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        ))}


                        <div className='col-md-6'>
                            <label className="form-label">Village</label>
                            <input
                                type="text"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Gender</label>
                            <select
                                className="form-select"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="form-control"
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Profile Image</label>

                            {/* Existing Image Preview */}
                            {formData.profileImage && typeof formData.profileImage === 'string' && (
                                <div className="mb-3">
                                    <img
                                        src={formData.profileImage}
                                        alt="Profile"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </div>
                            )}

                            {/* File Input to upload new image */}
                            <input
                                className="form-control"
                                type="file"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </div>


                        <div className="col-12 text-center mt-5">
                            <button className="btn btn-primary-600 text-center" type="submit">
                                Update Student
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentUpdateForm;
