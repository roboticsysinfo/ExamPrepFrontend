import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';

import {
    getExamsByInstituteId,
} from '../redux/slices/examSlice';
import {
    getSubjectsByExamId,
} from '../redux/slices/subjectSlice';
import {
    getTopicsBySubjectId,
} from '../redux/slices/topicSlice';
import {
    fetchQuestionsByFilter,
} from '../redux/slices/questionSlice';
import { createTest, clearTestState } from '../redux/slices/testSlice';

const CreateTestForm = () => {
    
    const dispatch = useDispatch();

    const { exams } = useSelector((state) => state.exam);
    const { subjects } = useSelector((state) => state.subject);
    const { topics } = useSelector((state) => state.topics);
    const { questions } = useSelector((state) => state.questions);
    const { user } = useSelector((state) => state.auth.user);
    const { loading, error, successMessage } = useSelector((state) => state.test);

    const instituteId = user?.instituteId;

    const [formData, setFormData] = useState({
        title: '',
        exam: '',
        subject: '',
        topic: '',
        duration: 30,
        totalMarks: 0,
        questions: [],
        isPaid: false,
        price: 0,
        instituteId: '',
    });

    // Fetch exams on load
    useEffect(() => {
        setFormData(prev => ({ ...prev, instituteId }));
        if (instituteId) {
            dispatch(getExamsByInstituteId(instituteId));
        }
    }, [dispatch, instituteId]);

    useEffect(() => {
        if (formData.exam) {
            dispatch(getSubjectsByExamId(formData.exam));
        }
    }, [formData.exam, dispatch]);

    useEffect(() => {
        if (formData.subject) {
            dispatch(getTopicsBySubjectId(formData.subject));
        }
    }, [formData.subject, dispatch]);

    // Fetch questions when filter changes
    useEffect(() => {
        if (formData.exam && formData.subject && formData.topic) {
            dispatch(fetchQuestionsByFilter({
                exam: formData.exam,
                subject: formData.subject,
                topic: formData.topic
            }));
        }
    }, [formData.exam, formData.subject, formData.topic, dispatch]);


    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearTestState());
            setFormData({
                title: '',
                exam: '',
                subject: '',
                topic: '',
                // difficulty removed
                duration: 30,
                totalMarks: 0,
                questions: [],
                isPaid: false,
                price: 0,
                instituteId,
            });
        }
        if (error) {
            toast.error(error);
            dispatch(clearTestState());
        }
    }, [successMessage, error, dispatch, instituteId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (['exam', 'subject', 'topic'].includes(name)) {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                questions: [],
                totalMarks: 0,
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleQuestionToggle = (id) => {
        setFormData(prev => {
            let updatedQuestions;
            if (prev.questions.includes(id)) {
                updatedQuestions = prev.questions.filter(q => q !== id);
            } else {
                updatedQuestions = [...prev.questions, id];
            }

            return {
                ...prev,
                questions: updatedQuestions,
                totalMarks: updatedQuestions.length,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.exam || !formData.subject || !formData.topic) {
            return toast.error('Exam, Subject, and Topic are required!');
        }

        if (formData.questions.length === 0) {
            return toast.error('Please select at least one question!');
        }

        if (formData.isPaid && (!formData.price || formData.price <= 0)) {
            return toast.error('Price is required for paid tests!');
        }

        dispatch(createTest(formData));
    };

    return (
        <div className="card mt-5 p-5">
            <div className='card-header d-flex align-items-center justify-content-between'>
                <h4>Create New Test</h4>
            </div>

            <div className='card-body'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Exam</Form.Label>
                                <Form.Select name="exam" value={formData.exam} onChange={handleChange} required>
                                    <option value="">Select Exam</option>
                                    {exams?.map((exam) => (
                                        <option key={exam._id} value={exam._id}>{exam.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject</Form.Label>
                                <Form.Select name="subject" value={formData.subject} onChange={handleChange} required>
                                    <option value="">Select Subject</option>
                                    {subjects?.map((sub) => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Topic</Form.Label>
                                <Form.Select name="topic" value={formData.topic} onChange={handleChange} required>
                                    <option value="">Select Topic</option>
                                    {topics?.map((topic) => (
                                        <option key={topic._id} value={topic._id}>{topic.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        {/* Difficulty field removed */}

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration (minutes)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Total Marks</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Paid?"
                                    name="isPaid"
                                    checked={formData.isPaid}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        {formData.isPaid && (
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Select Questions</Form.Label>
                        {questions?.length === 0 ? (
                            <p>No questions found for selected exam, subject, and topic.</p>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                                {questions.map((q) => (
                                    <Form.Check
                                        key={q._id}
                                        type="checkbox"
                                        id={`q-${q._id}`}
                                        label={q.question || q.questionText || q.text || 'Question text missing'}
                                        checked={formData.questions.includes(q._id)}
                                        onChange={() => handleQuestionToggle(q._id)}
                                    />
                                ))}
                            </div>
                        )}
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Create Test'}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default CreateTestForm;
