import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';

import {
    getAllExams,
} from '../redux/slices/examSlice';
import {
    getAllSubjects,
} from '../redux/slices/subjectSlice';
import {
    getAllTopics,
} from '../redux/slices/topicSlice';
import {
    fetchQuestionsByFilter,
} from '../redux/slices/questionSlice';

import { createTest, clearTestState } from '../redux/slices/testSlice';
import { Link } from 'react-router-dom';

const CreateTestForm = () => {
    
    const dispatch = useDispatch();

    const { exams } = useSelector((state) => state.exam);
    const { subjects } = useSelector((state) => state.subject);
    const { topics } = useSelector((state) => state.topics);
    const { questions } = useSelector((state) => state.questions);
    const { loading, error, successMessage } = useSelector((state) => state.test);

    const [formData, setFormData] = useState({
        title: '',
        exam: '',
        subject: '',
        topic: '',
        difficulty: 'easy',
        duration: 30,
        totalMarks: 0,  // Initialize as 0
        questions: [],
    });

    // Fetch initial data
    useEffect(() => {
        dispatch(getAllExams());
        dispatch(getAllTopics());
    }, [dispatch]);

    useEffect(() => {
        if (formData.exam) {
            dispatch(getAllSubjects(formData.exam));
        }
    }, [formData.exam, dispatch]);

    useEffect(() => {
        if (formData.exam && formData.subject && formData.topic) {
            dispatch(fetchQuestionsByFilter({
                examId: formData.exam,
                subjectId: formData.subject,
                topicId: formData.topic,
            }));
        }
    }, [formData.exam, formData.subject, formData.topic, dispatch]);

    // Toast handling
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearTestState());
            setFormData({
                title: '',
                exam: '',
                subject: '',
                topic: '',
                difficulty: 'easy',
                duration: 30,
                totalMarks: 0,
                questions: [],
            });
        }
        if (error) {
            toast.error(error);
            dispatch(clearTestState());
        }
    }, [successMessage, error, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'exam' || name === 'subject' || name === 'topic') {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                questions: [],
                totalMarks: 0, // Reset total marks when filters change
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Update questions and totalMarks on question checkbox toggle
    const handleQuestionToggle = (id) => {
        setFormData((prev) => {
            let updatedQuestions;
            if (prev.questions.includes(id)) {
                updatedQuestions = prev.questions.filter((q) => q !== id);
            } else {
                updatedQuestions = [...prev.questions, id];
            }
            return {
                ...prev,
                questions: updatedQuestions,
                totalMarks: updatedQuestions.length,  // 1 mark per question
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
        dispatch(createTest(formData));
    };

    return (
        <div className="card mt-5 p-5">
            <div className='card-header d-flex align-items-center justify-content-between'>
                <h4>Create New Test</h4>
            </div>

            <div className='card-body'>

                <Form onSubmit={handleSubmit} className='test_form'>
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
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Difficulty</Form.Label>
                                <Form.Select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
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
                        <Col md={4}>
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

                    {/* Questions List */}
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
