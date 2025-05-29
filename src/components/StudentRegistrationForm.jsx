import React, { useState } from 'react';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const StudentRegistrationForm = () => {

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
                data.append(key, formData[key]);
            }

            const res = await api.post('/student/register', data);

            toast.success('Student registered successfully!');
            console.log(res.data);

            // Navigate to students page after success
            navigate('/students');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Registration failed');
            // No navigation on error
        }
    };



    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Register New Student</h5>
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
                            <label className="form-label">Student Image</label>
                            <input
                                className="form-control"
                                type="file"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-12 text-center mt-5">
                            <button className="btn btn-primary-600 text-center" type="submit">
                                Register Student
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentRegistrationForm;
