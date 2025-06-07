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

const AdmissionQuery = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user);
  const instituteId = user?.instituteId;

  const { admissionQueries, loading, successMessage, error } = useSelector(
    (state) => state.admissionQuery
  );

  useEffect(() => {
    if (instituteId) {
      dispatch(fetchQueriesByInstituteId(instituteId));

    }
    const table = $('#dataTable').DataTable({ pageLength: 10 });
    return () => table.destroy(true);
  }, [dispatch, instituteId]);


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
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Address</th>
                  <th>Query Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && admissionQueries.length > 0 ? (
                  admissionQueries.map((query, index) => (
                    <tr key={query._id}>
                      <td>{index + 1}</td>
                      <td>{query.name}</td>
                      <td>{query.fatherName}</td>
                      <td>{query.phoneNumber}</td>
                      <td>{query.email}</td>
                      <td>{query.city}</td>
                      <td>{query.state}</td>
                      <td>{query.address}</td>
                      <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(query._id)}
                        >
                          <Icon icon="mingcute:delete-2-line" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
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
