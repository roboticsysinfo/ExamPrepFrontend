import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/axios';
import { getSubjectsByInstituteId } from '../redux/slices/subjectSlice';

const CreateTopicForm = () => {
  const dispatch = useDispatch();

  const { subjects, loading } = useSelector((state) => state.subject);
  const { user } = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    topicDetail: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.instituteId) {
      dispatch(getSubjectsByInstituteId(user?.instituteId));
    }
  }, [dispatch, user?.instituteId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuillChange = (value) => {
    setFormData({
      ...formData,
      topicDetail: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.subject || !formData.topicDetail) {
      return toast.error('Please fill all fields');
    }

    try {
      setSubmitting(true);

      const topicData = {
        ...formData,
        instituteId: user?.instituteId
      };

      const res = await api.post('/create-topic', topicData);
      toast.success(res.data.message || 'Topic created successfully!');
      setFormData({ name: '', subject: '', topicDetail: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create topic');
    } finally {
      setSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Body>
        <Card.Title>Create New Topic</Card.Title>
        <Form onSubmit={handleSubmit}>
          {/* Subject */}
          <Form.Group className="mb-3" controlId="subjectSelect">
            <Form.Label>Subject</Form.Label>
            <Form.Select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">-- Select Subject --</option>
              {subjects?.map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Topic Name */}
          <Form.Group className="mb-3" controlId="topicName">
            <Form.Label>Topic Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter topic name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Topic Detail (Rich Text) */}
          <Form.Group className="mb-3" controlId="topicDetail">
            <Form.Label>Topic Detail</Form.Label>
            <div className="quill-editor-wrapper" style={{ borderRadius: '6px', border: '1px solid #ced4da' }}>
              <ReactQuill
                theme="snow"
                value={formData.topicDetail}
                onChange={handleQuillChange}
                placeholder="Write detailed topic explanation here..."
                style={{
                  minHeight: '200px'
                }}
                modules={quillModules}
                formats={quillFormats}
              />
            </div>
          </Form.Group>

          {/* Submit Button */}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? <Spinner animation="border" size="sm" /> : 'Create Topic'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateTopicForm;
