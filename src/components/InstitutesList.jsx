import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { getAllInstitutes, updateInstitute, deleteInstitute } from '../redux/slices/instituteSlice';
import { Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';


const InstitutesList = () => {

  const dispatch = useDispatch();
  const { institutes } = useSelector((state) => state.institute);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [formData, setFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(getAllInstitutes());

    const table = $('#dataTable').DataTable({ pageLength: 10 });
    return () => table.destroy(true);
  }, [dispatch]);

  const handleEditClick = (institute) => {
    setSelectedInstitute(institute);
    setFormData({ ...institute });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateInstitute({ id: selectedInstitute._id, data: formData })).unwrap();
      toast.success('Institute updated successfully');
      setShowEditModal(false);
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this institute?')) return;
    try {
      await dispatch(deleteInstitute(id)).unwrap();
      toast.success('Institute deleted successfully');
    } catch (err) {
      toast.error(err || 'Delete failed');
    }
  };

  return (

    <div className="card mt-4">

      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">All Institutes</h5>
        <Link to="/register-institute" className="btn btn-primary">Register New Institute</Link>
      </div>

      <div className="card-body">
        
        <table className="table bordered-table mb-0" id="dataTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Reg. No</th>
              <th>Name</th>
              <th>City</th>
              <th>State</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {institutes.map((inst, i) => (
              <tr key={inst._id}>
                <td>{i + 1}</td>
                <td>{inst.instituteRegNumber}</td>
                <td>{inst.name}</td>
                <td>{inst.city}</td>
                <td>{inst.state}</td>
                <td>{inst.contactNumber}</td>
                <td>{inst.emailId}</td>
                <td>{new Date(inst.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEditClick(inst)}
                  >
                    <Icon icon="lucide:edit" />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(inst._id)}
                  >
                    <Icon icon="mingcute:delete-2-line" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal using React-Bootstrap */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Institute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            className="mb-2"
            name="name"
            placeholder="Institute Name"
            value={formData.name || ''}
            onChange={handleInputChange}
          />
          <Form.Control
            type="text"
            className="mb-2"
            name="city"
            placeholder="City"
            value={formData.city || ''}
            onChange={handleInputChange}
          />
          <Form.Control
            type="text"
            className="mb-2"
            name="state"
            placeholder="State"
            value={formData.state || ''}
            onChange={handleInputChange}
          />
          <Form.Control
            type="text"
            className="mb-2"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber || ''}
            onChange={handleInputChange}
          />
          <Form.Control
            type="email"
            className="mb-2"
            name="emailId"
            placeholder="Email"
            value={formData.emailId || ''}
            onChange={handleInputChange}
          />
          <Form.Control
            type="text"
            className="mb-2"
            name="address"
            placeholder="Address"
            value={formData.address || ''}
            onChange={handleInputChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InstitutesList;
