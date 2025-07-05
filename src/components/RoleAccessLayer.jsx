import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createUser,
  updateUser,
  deleteUser,
  getUsersByInstituteId,
} from '../redux/slices/userSlice';
import { toast } from 'react-toastify';

const RoleAccessLayer = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth.user);
  const user = auth?.user || {};
  const instituteId = user?.instituteId;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    instituteId: '',
    phoneNumber: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (instituteId) {
      setFormData((prev) => ({ ...prev, instituteId }));
      dispatch(getUsersByInstituteId(instituteId));
    }
  }, [instituteId, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await dispatch(updateUser({ id: editId, data: formData }));
        toast.success('User updated successfully');
      } else {
        await dispatch(createUser(formData));
        toast.success('User created successfully');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }

    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'teacher',
      instituteId,
      phoneNumber: '',
    });

    setEditMode(false);
    setEditId(null);
    document.getElementById('userModalCloseBtn')?.click();
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setEditId(user._id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'teacher',
      instituteId: user.instituteId || '',
      phoneNumber: user.phoneNumber || '',
    });

    document.getElementById('editUserModalBtn')?.click();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <>
      {/* Hidden trigger for programmatic modal opening */}
      <button
        id="editUserModalBtn"
        type="button"
        style={{ display: 'none' }}
        data-bs-toggle="modal"
        data-bs-target="#userModal"
      />

      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <button
            type="button"
            className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
            onClick={() => {
              setEditMode(false);
              setFormData({
                name: '',
                email: '',
                password: '',
                role: 'teacher',
                instituteId,
                phoneNumber: '',
              });
            }}
          >
            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
            Add New User
          </button>
        </div>

        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th>S.L</th>
                  <th>Create Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{String(index + 1).padStart(2, '0')}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber || '-'}</td>
                    <td className="text-center">
                      <span className="bg-primary-focus text-primary-600 border border-primary-main px-24 py-4 radius-4 fw-medium text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center gap-10 justify-content-center">
                        <button
                          className="bg-success-focus text-success-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleEdit(user)}
                        >
                          <Icon icon="lucide:edit" />
                        </button>
                        <button
                          className="bg-danger-focus text-danger-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Icon icon="fluent:delete-24-regular" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <div className="modal fade" id="userModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border-bottom">
              <h1 className="modal-title fs-5">{editMode ? 'Edit User' : 'Add New User'}</h1>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="userModalCloseBtn"
              />
            </div>
            <div className="modal-body p-24">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-sm mb-8">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control radius-8"
                      placeholder="Enter user name"
                      required
                    />
                  </div>
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-sm mb-8">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control radius-8"
                      placeholder="Enter user email"
                      required
                    />
                  </div>
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-sm mb-8">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="form-control radius-8"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  {!editMode && (
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-sm mb-8">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control radius-8"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  )}
                  <div className="col-12 mb-20">
                    <label className="form-label fw-semibold text-sm mb-8">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="form-select radius-8"
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                    <button
                      type="reset"
                      className="border border-danger-600 text-danger-600 px-40 py-11 radius-8"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-48 py-12 radius-8">
                      {editMode ? 'Update' : 'Save'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleAccessLayer;
