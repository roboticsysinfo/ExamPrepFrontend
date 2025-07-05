import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  fetchQueriesByInstituteId,
  deleteAdmissionQuery,
  clearMessages,
} from '../redux/slices/admissionQuerySlice';
import api from '../utils/axios';

const AdmissionQuery = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user);
  const instituteId = user?.instituteId;

  const { admissionQueries, loading, successMessage, error } = useSelector(
    (state) => state.admissionQuery
  );

  console.log("admissionQueries", admissionQueries);

  useEffect(() => {
    if (admissionQueries.length > 0) {
      if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
      }
      setTimeout(() => {
        $('#dataTable').DataTable({
          pageLength: 10,
          order: [[13, 'desc']], // Sort by Query Date (14th column, index 13)
        });
      }, 0);
    }
  }, [admissionQueries]);


  // Show toast on success or error
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);


  const handleAddmissionQuery = async (query) => {
    try {
      const formData = new FormData();

      const fields = [
        'instituteId', 'name', 'fatherName', 'motherName',
        'phoneNumber', 'email', 'address', 'state', 'city',
        'village', 'dob', 'gender'
      ];

      fields.forEach(field => {
        formData.append(field, query[field] || '');
      });

      // Handle image
      if (query.profileImage && query.profileImage.startsWith('file')) {
        // Android/iOS local URI – skip or upload separately if needed
        toast.warning("Profile image is a local file URI and cannot be uploaded directly from admin panel.");
      } else {
        // Remote image
        const imageUrl = query.profileImage || 'https://dummyimage.com/150x150/cccccc/000000&text=Profile';
        formData.append('profileImage', imageUrl); // Or fetch and re-upload if needed
      }

      const res = await api.post('/student/register', formData);
      toast.success('Student registered successfully!');

      // delete admission query after registration success
      dispatch(deleteAdmissionQuery(query._id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Student registration failed');
    }
  };



  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admission query?')) {
      dispatch(deleteAdmissionQuery(id));
    }
  };

  return (
    <>
      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0">Admission Queries</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table bordered-table mb-0" id="dataTable">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Mother's Name</th>
                  <th>Phone</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Village</th>
                  <th>Address</th>
                  <th>Query Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {!loading && admissionQueries.length > 0 ? (
                  admissionQueries.map((query, index) => (
                    <tr key={query._id}>
                      <td>{index + 1}</td> {/* S.No */}
                      <td>
                        <img
                          src={query.profileImage || "https://placehold.jp/60x60.png"}
                          alt={query.name}
                          width={60}
                          height={60}
                        />
                      </td> {/* Photo */}
                      <td>{query.name}</td> {/* Name */}
                      <td>{query.fatherName}</td> {/* Father's Name */}
                      <td>{query.motherName}</td> {/* Mother's Name */}
                      <td>{query.phoneNumber}</td> {/* Phone */}
                      <td>{query.dob}</td> {/* DOB */}
                      <td>{query.gender}</td> {/* Gender */}
                      <td>{query.email}</td> {/* Email */}
                      <td>{query.state}</td> {/* State */}
                      <td>{query.city}</td> {/* City */}
                      <td>{query.village}</td> {/* Village */}
                      <td>{query.address}</td> {/* Address */}
                      <td>{new Date(query.createdAt).toLocaleDateString()}</td> {/* Query Date */}
                      <td>
                        <button
                          className="btn btn-sm btn-info me-1"
                          onClick={() => handleAddmissionQuery(query)}
                        >
                          Register
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(query._id)}
                        >
                          <Icon icon="mingcute:delete-2-line" />
                        </button>
                      </td> {/* Actions */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" className="text-center">
                      {loading ? 'Loading...' : 'No admission queries found'}
                    </td>
                  </tr>
                )}
              </tbody>


            </table>
          </div>
        </div>
      </div>


    </>
  );
};

export default AdmissionQuery;
