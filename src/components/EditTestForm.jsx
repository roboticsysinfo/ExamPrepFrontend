import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

import {
    fetchTestById,
    updateTest,
    clearTestState,
} from '../redux/slices/testSlice';

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

const EditTestForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { exams } = useSelector((state) => state.exam);
    const { subjects } = useSelector((state) => state.subject);
    const { topics } = useSelector((state) => state.topics);
    const { questions } = useSelector((state) => state.questions);
    const { user } = useSelector((state) => state.auth.user);
    const { currentTest, successMessage, error } = useSelector((state) => state.test);

    const instituteId = user?.instituteId

    console.log("current test", currentTest)

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

    const [questionBank, setQuestionBank] = useState([]); // To store and merge selected + filtered questions

    useEffect(() => {
        dispatch(fetchTestById(id));
    }, [dispatch, id]);

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
        if (currentTest) {
            setFormData({
                title: currentTest.title || '',
                exam: currentTest.exam._id || '',            // prefill exam from currentTest
                subject: currentTest.subject._id || '',      // prefill subject from currentTest
                topic: currentTest.topic._id || '',          // prefill topic from currentTest
                duration: currentTest.duration || 30,
                isPaid: currentTest.isPaid || false,
                price: currentTest.price || 0,
                totalMarks: currentTest.totalMarks || 0, // prefill totalMarks from currentTest
                questions: currentTest.questions?.map(q => q._id || q) || [],
            });

            // Initialize question bank with selected questions
            const selectedQuestions = currentTest.questions || [];
            setQuestionBank(prev => {
                const uniqueMap = new Map();
                [...prev, ...selectedQuestions].forEach(q => {
                    const id = q._id || q;
                    if (!uniqueMap.has(id)) {
                        uniqueMap.set(id, q);
                    }
                });
                return Array.from(uniqueMap.values());
            });
        }
    }, [currentTest]);


    // Merge fetched questions with selected questions
    useEffect(() => {
        const combined = [...questions, ...(currentTest?.questions || [])];

        const uniqueMap = new Map();
        combined.forEach((q) => {
            const id = q._id || q;
            if (!uniqueMap.has(id)) {
                uniqueMap.set(id, q);
            }
        });

        setQuestionBank(Array.from(uniqueMap.values()));
    }, [questions, currentTest]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearTestState());
            navigate('/tests');
        }

        if (error) {
            toast.error(error);
            dispatch(clearTestState());
        }
    }, [successMessage, error, dispatch, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'exam' || name === 'subject' || name === 'topic') {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                questions: [],
                totalMarks: 0,
            }));
            setQuestionBank([]); // Reset bank on filter change
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleQuestionToggle = (questionId) => {
        setFormData((prev) => {
            const alreadySelected = prev.questions.includes(questionId);
            const updatedQuestions = alreadySelected
                ? prev.questions.filter((q) => q !== questionId)
                : [...prev.questions, questionId];

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
            return toast.error('Please fill in Exam, Subject and Topic!');
        }

        if (formData.questions.length === 0) {
            return toast.error('Please select at least one question!');
        }

        dispatch(updateTest({ id, updatedData: formData }));
    };

    return (
        <div className="card mt-5 p-4">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h4>Edit Test</h4>
            </div>

            <div className="card-body">
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
                                    {exams.map((exam) => (
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
                                    {subjects.map((subject) => (
                                        <option key={subject._id} value={subject._id}>{subject.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Topic</Form.Label>
                                <Form.Select name="topic" value={formData.topic} onChange={handleChange} required>
                                    <option value="">Select Topic</option>
                                    {topics.map((topic) => (
                                        <option key={topic._id} value={topic._id}>{topic.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>


                    <Row>
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

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration (minutes)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    required
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
                        <Form.Label>Selected Questions ( if you want to remove question uncheck it. )</Form.Label>

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
                    </Form.Group>

                    <Button type="submit" variant="primary">
                        Update Test
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default EditTestForm;
