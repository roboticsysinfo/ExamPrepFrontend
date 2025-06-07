import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchExamCategories,
    deleteExamCategory,
    updateExamCategory,
    fetchExamCategoriesByInstituteId
} from '../redux/slices/exanCategorySlice';
import { toast } from 'react-toastify';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const ExamCategoriesList = () => {

    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.examCategory);
    const { user } = useSelector(state => state.auth.user);
    const instituteId = user?.instituteId;

    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (instituteId) {
            dispatch(fetchExamCategoriesByInstituteId(instituteId));
        }
    }, [dispatch, instituteId]);

    useEffect(() => {
        if (categories.length > 0) {
            const timeout = setTimeout(() => {
                if (!$.fn.dataTable.isDataTable('#dataTable')) {
                    $('#dataTable').DataTable();
                }
            }, 0);

            return () => {
                if ($.fn.dataTable.isDataTable('#dataTable')) {
                    $('#dataTable').DataTable().destroy();
                }
                clearTimeout(timeout);
            };
        }
    }, [categories]);

    const handleDelete = (id) => {
        dispatch(deleteExamCategory(id))
            .unwrap()
            .then(() => toast.success('Category deleted successfully'))
            .catch((err) => toast.error(err));
    };

    const handleEditClick = (category) => {
        setEditData(category);
        setShowModal(true);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        dispatch(updateExamCategory({ id: editData._id, formData }))
            .unwrap()
            .then(() => {
                toast.success('Category updated successfully');
                setShowModal(false);
                setEditData(null);
            })
            .catch((err) => toast.error(err));
    };

    return (
        <div className="card basic-data-table">

            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Create Exam Category</h5>
                <Link to="/create-exam-category" className="btn btn-primary btn-sm">
                    + Create Exam Category
                </Link>
            </div>

            <div className="card-body">
                <table className="table mb-0" id="dataTable">
                    <thead>
                        <tr>
                            <th>S.L</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={cat._id}>
                                <td>{index + 1}</td>
                                <td>{cat.name}</td>
                                <td>
                                    <img src={cat.e_category_img} alt="category" width={80} height={50} />
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleEditClick(cat)}
                                        className="btn btn-sm btn-success me-2"
                                    >
                                        <Icon icon="lucide:edit" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        <Icon icon="mingcute:delete-2-line" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Category</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label>Name</label>
                                        <input
                                            name="name"
                                            defaultValue={editData.name}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            defaultValue={editData.description}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Image</label>
                                        <input type="file" name="e_category_img" className="form-control" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamCategoriesList;
