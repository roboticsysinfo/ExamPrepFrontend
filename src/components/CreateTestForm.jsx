import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

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

const CreateMockTestForm = () => {
    const dispatch = useDispatch();

    const { exams } = useSelector((state) => state.exam);
    const { subjects } = useSelector((state) => state.subject);
    const { topics } = useSelector((state) => state.topics);
    const { questions, pagination } = useSelector((state) => state.questions);
    const { user } = useSelector((state) => state.auth.user);
    const { loading, error, successMessage } = useSelector((state) => state.test);

    const instituteId = user?.instituteId;

    const [formData, setFormData] = useState({
        title: '',
        exam: '',
        subject: '',
        topic: [],
        duration: 30,
        totalMarks: 0,
        questions: [],
        isPaid: false,
        price: 0,
        instituteId: '',
    });

    const [page, setPage] = useState(1);

    useEffect(() => {
        setFormData((prev) => ({ ...prev, instituteId }));
        if (instituteId) dispatch(getExamsByInstituteId(instituteId));
    }, [dispatch, instituteId]);

    useEffect(() => {
        if (formData.exam) dispatch(getSubjectsByExamId(formData.exam));
    }, [formData.exam, dispatch]);

    useEffect(() => {
        if (formData.subject) dispatch(getTopicsBySubjectId(formData.subject));
    }, [formData.subject, dispatch]);

    useEffect(() => {
        if (formData.exam && formData.subject && formData.topic.length > 0) {
            dispatch(fetchQuestionsByFilter({
                exam: formData.exam,
                subject: formData.subject,
                topic: formData.topic,
                page,
                limit: 50,
            }));
        }
    }, [formData.exam, formData.subject, formData.topic, page, dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearTestState());
            setFormData({
                title: '',
                exam: '',
                subject: '',
                topic: [],
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

    const handleTopicChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const updated = checked
                ? [...prev.topic, value]
                : prev.topic.filter((id) => id !== value);
            return { ...prev, topic: updated, questions: [], totalMarks: 0 };
        });
        setPage(1);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (['exam', 'subject'].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                topic: [],
                questions: [],
                totalMarks: 0,
            }));
            setPage(1);
        } else if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleQuestionToggle = (id) => {
        setFormData((prev) => {
            const updatedQuestions = prev.questions.includes(id)
                ? prev.questions.filter((q) => q !== id)
                : [...prev.questions, id];
            return { ...prev, questions: updatedQuestions, totalMarks: updatedQuestions.length };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { exam, subject, topic, questions, isPaid, price } = formData;
        if (!exam || !subject || topic.length === 0) return toast.error('Please fill all fields.');
        if (questions.length === 0) return toast.error('Select at least one question.');
        if (isPaid && (!price || price <= 0)) return toast.error('Enter valid price for paid test.');
        dispatch(createTest(formData));
    };

    return (
        <div className="card mt-5 p-5">
            <div className='card-header d-flex align-items-center justify-content-between'>
                <h4>Create New Mock Test</h4>
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
                                <Form.Label>Topics</Form.Label>
                                <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {topics?.map((topic) => (
                                        <Form.Check
                                            key={topic._id}
                                            type="checkbox"
                                            label={topic.name}
                                            value={topic._id}
                                            checked={formData.topic.includes(topic._id)}
                                            onChange={handleTopicChange}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
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
                        {questions.length === 0 ? (
                            <p>No questions found for selected filters.</p>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                                <table className="table table-bordered table-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Select</th>
                                            <th>Question</th>
                                            <th>Topic</th>
                                            <th>Difficulty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((q, i) => (
                                            <tr key={q._id}>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={formData.questions.includes(q._id)}
                                                        onChange={() => handleQuestionToggle(q._id)}
                                                    />
                                                </td>
                                                <td>{q.questionText || 'No text'}</td>
                                                <td>{q.topic?.name || '-'}</td>
                                                <td>{q.difficulty || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {pagination && pagination.page < pagination.totalPages && (
                            <div className="text-center mt-3">
                                <Button
                                    variant="outline-primary"
                                    onClick={() => setPage((prev) => prev + 1)}
                                >
                                    Load More
                                </Button>
                            </div>
                        )}
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Create Mock Test'}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default CreateMockTestForm;