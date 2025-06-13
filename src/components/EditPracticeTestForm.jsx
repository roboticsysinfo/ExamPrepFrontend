import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

import {
  fetchPracticeTestById,
  updatePracticeTest,
  clearState,
} from '../redux/slices/practiceTestSlice';

import { getExamsByInstituteId } from '../redux/slices/examSlice';
import { getSubjectsByExamId } from '../redux/slices/subjectSlice';
import { getTopicsBySubjectId } from '../redux/slices/topicSlice';
import { fetchQuestionsByFilter } from '../redux/slices/questionSlice';

const EditPracticeTestForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { exams } = useSelector(state => state.exam);
  const { subjects } = useSelector(state => state.subject);
  const { topics } = useSelector(state => state.topics);
  const { questions } = useSelector(state => state.questions);
  const { user } = useSelector(state => state.auth.user);
  const { currentTest, successMessage, error } = useSelector(state => state.practiceTests);

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

  const [questionBank, setQuestionBank] = useState([]);

  useEffect(() => {
    dispatch(fetchPracticeTestById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (instituteId) {
      setFormData(prev => ({ ...prev, instituteId }));
      dispatch(getExamsByInstituteId(instituteId));
    }
  }, [instituteId, dispatch]);

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
        exam: currentTest.exam?._id || '',
        subject: currentTest.subject?._id || '',
        topic: currentTest.topic?._id || '',
        duration: currentTest.duration || 30,
        isPaid: currentTest.isPaid || false,
        price: currentTest.price || 0,
        totalMarks: currentTest.totalMarks || 0,
        questions: currentTest.questions?.map(q => q._id || q) || [],
        instituteId: currentTest.instituteId || instituteId,
      });

      const selectedQuestions = currentTest.questions || [];
      setQuestionBank(prev => {
        const map = new Map();
        [...prev, ...selectedQuestions].forEach(q => {
          const id = q._id || q;
          if (!map.has(id)) map.set(id, q);
        });
        return Array.from(map.values());
      });
    }
  }, [currentTest, instituteId]);

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
      dispatch(clearState());
      navigate('/practice-tests');
    }
    if (error) {
      toast.error(error);
      dispatch(clearState());
    }
  }, [successMessage, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (['exam', 'subject', 'topic'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        questions: [],
        totalMarks: 0,
      }));
      setQuestionBank([]);
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }
  };

  const handleQuestionToggle = (questionId) => {
    setFormData(prev => {
      const alreadySelected = prev.questions.includes(questionId);
      const updatedQuestions = alreadySelected
        ? prev.questions.filter(q => q !== questionId)
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
      return toast.error('Please fill in Exam, Subject, and Topic!');
    }
    if (formData.questions.length === 0) {
      return toast.error('Please select at least one question!');
    }

    dispatch(updatePracticeTest({ id, updatedData: formData }));
  };

  return (
    <div className="card mt-5 p-4">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4>Edit Practice Test</h4>
      </div>
      <div className="card-body">
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
                  {exams.map(exam => (
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
                  {subjects.map(subject => (
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
                  {topics.map(topic => (
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
                <Form.Control type="number" name="totalMarks" value={formData.totalMarks} readOnly />
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
            <Form.Label>Selected Questions</Form.Label>
            {questionBank.map(q => (

              <div
                key={q._id}
                className="form-check d-flex justify-content-between align-items-center border p-2 mb-2 rounded"
              >
                <div className="d-flex align-items-center">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id={`q-${q._id}`}
                    checked={formData.questions.includes(q._id)}
                    onChange={() => handleQuestionToggle(q._id)}
                  />
                  <label className="form-check-label" htmlFor={`q-${q._id}`}>
                    {q.question || q.questionText || q.text || 'Unnamed question'}
                  </label>
                </div>
                <small className="text-muted ">{q.difficulty || 'N/A'}</small>
              </div>



            ))}
          </Form.Group>

          <Button type="submit" variant="primary">Update Practice Test</Button>
        </Form>
      </div>
    </div>
  );
};

export default EditPracticeTestForm;
