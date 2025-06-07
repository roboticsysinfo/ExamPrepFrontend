import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInstitute, clearInstituteState } from '../redux/slices/instituteSlice';
import { toast } from 'react-toastify';

const RegisterInstituteForm = () => {

  const dispatch = useDispatch();
  const { loading, success, error, message } = useSelector((state) => state.institute);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    address: '',
    contactNumber: '',
    emailId: '',
  });

  useEffect(() => {
    if (success) {
      toast.success(message || 'Institute registered successfully!');
      dispatch(clearInstituteState());
      setFormData({
        name: '',
        city: '',
        state: '',
        address: '',
        contactNumber: '',
        emailId: '',
      });
    }
    if (error) {
      toast.error(error || 'Failed to register institute!');
      dispatch(clearInstituteState());
    }
  }, [success, error, message, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createInstitute(formData));
  };

  return (
    <div className="row justify-content-center mt-4">

      <div className='col-md-6 col-xs-12'>

        <div className="card shadow">
          <div className="card-body">

            <h3 className="card-title mb-4">Register Institute</h3>

            <hr />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Institute Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="state" className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="emailId" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailId"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Registering...' : 'Register Institute'}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RegisterInstituteForm;
