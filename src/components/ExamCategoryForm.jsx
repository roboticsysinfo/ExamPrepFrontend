import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExamCategory } from '../redux/slices/exanCategorySlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ExamCategoryForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get instituteId from auth slice
  const { user } = useSelector((state) => state.auth.user);
  const instituteId = user?.instituteId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    e_category_img: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'e_category_img') {
      setFormData({ ...formData, e_category_img: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.e_category_img) {
      data.append('e_category_img', formData.e_category_img);
    }

    // Add instituteId to formData
    if (instituteId) {
      data.append('instituteId', instituteId);
    } else {
      toast.error('Institute ID not found.');
      return;
    }

    setLoading(true);
    try {
      await dispatch(createExamCategory(data)).unwrap();
      toast.success('Exam Category Created Successfully');
      setFormData({ name: '', description: '', e_category_img: null });
      document.getElementById('e_category_img').value = '';
      navigate("/exam-categories");
    } catch (err) {
      toast.error(err || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4 shadow">
      <Card.Header>Create Exam Category</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter category name"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              placeholder="Enter description"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image (optional)</Form.Label>
            <Form.Control
              type="file"
              name="e_category_img"
              id="e_category_img"
              onChange={handleChange}
              accept="image/*"
            />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Create Category'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ExamCategoryForm;
