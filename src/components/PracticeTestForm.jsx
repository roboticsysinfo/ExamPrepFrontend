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
    const { questions, pagination } = useSelector((state) => state.questions);
    const { user } = useSelector((state) => state.auth.user);
    const { loading, error, successMessage } = useSelector((state) => state.practiceTests);
    const [page, setPage] = useState(1);


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
        if (formData.exam && formData.subject && formData.topic?.length) {
            dispatch(fetchQuestionsByFilter({
                exam: formData.exam,
                subject: formData.subject,
                topic: formData.topic,
                page,
                limit: 50
            }));
        }
    }, [formData.exam, formData.subject, formData.topic, page, dispatch]);




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
                                <Form.Label>Select Topics</Form.Label>
                                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                                    {topics?.map((topic) => (
                                        <Form.Check
                                            key={topic._id}
                                            type="checkbox"
                                            id={`topic-${topic._id}`}
                                            label={topic.name}
                                            value={topic._id}
                                            checked={formData.topic.includes(topic._id)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                const value = e.target.value;

                                                setFormData((prev) => {
                                                    const updatedTopics = checked
                                                        ? [...prev.topic, value]
                                                        : prev.topic.filter((id) => id !== value);

                                                    return {
                                                        ...prev,
                                                        topic: updatedTopics,
                                                        questions: [],
                                                        totalMarks: 0,
                                                    };
                                                });

                                                setPage(1); // Reset pagination on topic change
                                            }}
                                        />
                                    ))}
                                </div>
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
                        <h5 style={{ fontSize: 16 }}>Total Marks: {formData.totalMarks}</h5>
                        {loading && <Spinner animation="border" size="sm" />}
                        {questions.length === 0 && !loading && (
                            <p>No questions available for the selected filters.</p>
                        )}

                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="table table-bordered table-striped table-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Select</th>
                                        <th>Question</th>
                                        <th>Topic</th>
                                        <th>Difficulty</th>
                                        <th>Marks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((q, index) => (
                                        <tr key={q._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`q-${q._id}`}
                                                    checked={formData.questions.includes(q._id)}
                                                    onChange={() => handleQuestionToggle(q._id)}
                                                />
                                            </td>
                                            <td>{q.question || q.questionText || q.text || <i>No text</i>}</td>
                                            <td>{q.topic?.name || '-'}</td>
                                            <td>{q.difficulty || '-'}</td>
                                            <td>{q.marks || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>



                        {pagination && pagination.page < pagination.totalPages && (
                            <div className="text-center mt-3">
                                <Button variant="outline-primary" onClick={() => setPage(page + 1)}>
                                    Load More Questions →
                                </Button>
                            </div>
                        )}


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
