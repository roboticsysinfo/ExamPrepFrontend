import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../utils/axios';
import { getAllSubjects } from '../redux/slices/subjectSlice';

const CreateTopicForm = () => {
    const dispatch = useDispatch();
    const { subjects, loading } = useSelector((state) => state.subject);

    const [formData, setFormData] = useState({
        name: '',
        subject: ''
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(getAllSubjects());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.subject) {
            return toast.error('Please fill all fields');
        }

        try {
            setSubmitting(true);
            const res = await api.post('/create-topic', formData);
            toast.success(res.data.message);
            setFormData({ name: '', subject: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create topic');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="mt-4 shadow-sm">
            <Card.Body>
                <Card.Title>Create New Topic</Card.Title>
                <Form onSubmit={handleSubmit}>
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

                    <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? <Spinner animation="border" size="sm" /> : 'Create Topic'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CreateTopicForm;
