import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';

import {
    createPracticeTest,
    clearState,
} from '../redux/slices/practiceTestSlice';

import { getExamsByInstituteId } from '../redux/slices/examSlice';
import { getSubjectsByExamId } from '../redux/slices/subjectSlice';
import { getTopicsBySubjectId } from '../redux/slices/topicSlice';
import { fetchQuestionsByFilter } from '../redux/slices/questionSlice';

const PracticeTestForm = () => {
    const dispatch = useDispatch();

    // Redux state
    const { exams } = useSelector((state) => state.exam);
    const { subjects } = useSelector((state) => state.subject);
    const { topics } = useSelector((state) => state.topics);
    const { questions } = useSelector((state) => state.questions);
    const { user } = useSelector((state) => state.auth.user);
    const { loading, error, successMessage } = useSelector((state) => state.practiceTests);

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

    // On load: set institute and fetch exams
    useEffect(() => {
        setFormData((prev) => ({ ...prev, instituteId }));
        if (instituteId) {
            dispatch(getExamsByInstituteId(instituteId));
        }
    }, [dispatch, instituteId]);

    // Fetch subjects when exam changes
    useEffect(() => {
        if (formData.exam) {
            dispatch(getSubjectsByExamId(formData.exam));
        }
    }, [formData.exam, dispatch]);

    // Fetch topics when subject changes
    useEffect(() => {
        if (formData.subject) {
            dispatch(getTopicsBySubjectId(formData.subject));
        }
    }, [formData.subject, dispatch]);

    // Fetch questions when exam, subject, and topic change
    useEffect(() => {
        if (formData.exam && formData.subject && formData.topic) {
            dispatch(fetchQuestionsByFilter({
                exam: formData.exam,
                subject: formData.subject,
                topic: formData.topic,
            }));
        }
    }, [formData.exam, formData.subject, formData.topic, dispatch]);

    // Handle success/error toast & reset form
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearState());
            setFormData({
                title: '',
                exam: '',
                subject: '',
                topic: '',
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
            dispatch(clearState());
        }
    }, [successMessage, error, dispatch, instituteId]);

    // Form field change handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (['exam', 'subject', 'topic'].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                questions: [],
                totalMarks: 0,
            }));
        } else if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Toggle question selection & update total marks sum
    const handleQuestionToggle = (id) => {
        setFormData((prev) => {
            let updatedQuestions;
            if (prev.questions.includes(id)) {
                updatedQuestions = prev.questions.filter((q) => q !== id);
            } else {
                updatedQuestions = [...prev.questions, id];
            }

            // Calculate total marks of selected questions
            const totalMarksSum = updatedQuestions.reduce((sum, qId) => {
                const question = questions.find(q => q._id === qId);
                return sum + (question?.marks || 0);
            }, 0);

            return {
                ...prev,
                questions: updatedQuestions,
                totalMarks: totalMarksSum,
            };
        });
    };

    // Submit form
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

        dispatch(createPracticeTest(formData));
    };

    return (
        <Container className="mt-5 p-4 card">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h4>Create New Practice Test</h4>
            </div>
            <div className="card-body">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
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
                            <Form.Group className="mb-3" controlId="exam">
                                <Form.Label>Exam</Form.Label>
                                <Form.Select
                                    name="exam"
                                    value={formData.exam}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Exam</option>
                                    {exams?.map((exam) => (
                                        <option key={exam._id} value={exam._id}>
                                            {exam.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="subject">
                                <Form.Label>Subject</Form.Label>
                                <Form.Select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects?.map((sub) => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="topic">
                                <Form.Label>Topic</Form.Label>
                                <Form.Select
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Topic</option>
                                    {topics?.map((topic) => (
                                        <option key={topic._id} value={topic._id}>
                                            {topic.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="duration">
                                <Form.Label>Duration (minutes)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    min={1}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} className="d-flex align-items-center">
                            <Form.Check
                                type="checkbox"
                                label="Paid Test?"
                                name="isPaid"
                                checked={formData.isPaid}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    {formData.isPaid && (
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                min={0}
                                onChange={handleChange}
                                required={formData.isPaid}
                            />
                        </Form.Group>
                    )}

                    <div className="mb-3">
                        <h5>Questions Selected: {formData.questions.length}</h5>
                        <h5 style={{fontSize: 16}}>Total Marks: {formData.totalMarks}</h5>
                        {loading && <Spinner animation="border" size="sm" />}
                        {questions.length === 0 && !loading && (
                            <p>No questions available for the selected filters.</p>
                        )}
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                            {questions.map((q) => (
                                <Form.Check
                                    key={q._id}
                                    type="checkbox"
                                    id={`q-${q._id}`}
                                    label={`${q.question || q.questionText || q.text || 'Question text missing'} (Marks: ${q.marks || 0})`}
                                    checked={formData.questions.includes(q._id)}
                                    onChange={() => handleQuestionToggle(q._id)}
                                />
                            ))}
                        </div>
                    </div>

                    <Button type="submit" variant="success" disabled={loading}>
                        {loading ? 'Saving...' : 'Create Practice Test'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default PracticeTestForm;
