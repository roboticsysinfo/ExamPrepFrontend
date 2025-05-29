import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllExams,
} from '../redux/slices/examSlice'; // your exam slice actions
import {
  getAllSubjects,
} from '../redux/slices/subjectSlice';
import {
  getAllTopics,
} from '../redux/slices/topicSlice';
import {
  fetchQuestionsByFilter,
  deleteQuestion,
  updateQuestion,
  clearSelectedQuestion,
} from '../redux/slices/questionSlice';

import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function QuestionManager() {
  const dispatch = useDispatch();

  const { questions, loading, error } = useSelector((state) => state.questions);
  const { exams } = useSelector((state) => state.exam);
  const { subjects } = useSelector((state) => state.subject);
  const { topics } = useSelector((state) => state.topics);

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);

  const [editForm, setEditForm] = useState({
    exam: '',
    subject: '',
    topic: '',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswerIndex: '',
    explanation: '',
  });

  useEffect(() => {
    dispatch(getAllExams());
    dispatch(getAllTopics());
  }, [dispatch]);

  useEffect(() => {
    if (selectedExam) {
      dispatch(getAllSubjects(selectedExam));
      setSelectedSubject('');
      setSelectedTopic('');
    }
  }, [selectedExam, dispatch]);

  useEffect(() => {
    setSelectedTopic('');
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedExam && selectedSubject && selectedTopic) {
      dispatch(fetchQuestionsByFilter({
        exam: selectedExam,
        subject: selectedSubject,
        topic: selectedTopic,
      }));
    }
  }, [selectedExam, selectedSubject, selectedTopic, dispatch]);

  const handleEditClick = (question) => {
    setEditQuestion(question);
    dispatch(getAllSubjects(question.exam)); // fetch subjects for exam
    setEditForm({
      exam: question.exam || '',
      subject: question.subject || '',
      topic: question.topic || '',
      questionText: question.text || question.questionText || '',
      options: question.options || ['', '', '', ''],
      correctAnswerIndex: question.correctAnswerIndex?.toString() || '',
      explanation: question.explanation || '',
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...editForm, [name]: value };

    // reset subject/topic if exam changes
    if (name === 'exam') {
      updated.subject = '';
      updated.topic = '';
      dispatch(getAllSubjects(value));
    }

    setEditForm(updated);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editForm.options];
    updatedOptions[index] = value;
    setEditForm({ ...editForm, options: updatedOptions });
  };

  const addOption = () => {
    if (editForm.options.length < 6) {
      setEditForm({ ...editForm, options: [...editForm.options, ''] });
    }
  };

  const removeOption = (index) => {
    const updated = [...editForm.options];
    updated.splice(index, 1);
    setEditForm({ ...editForm, options: updated, correctAnswerIndex: '' });
  };

  const handleSaveEdit = () => {
    if (!editQuestion) return;
    dispatch(updateQuestion({
      id: editQuestion._id,
      formData: {
        exam: editForm.exam,
        subject: editForm.subject,
        topic: editForm.topic,
        questionText: editForm.questionText,
        options: editForm.options,
        correctAnswerIndex: parseInt(editForm.correctAnswerIndex),
        explanation: editForm.explanation,
      },
    })).then(() => {
      setShowEditModal(false);
      setEditQuestion(null);
    });
  };


  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this question?');
    if (confirmed) {
      dispatch(deleteQuestion(id))
        .unwrap()
        .then(() => {
          toast.success("Question deleted successfully.");
        })
        .catch(() => {
          toast.error("Failed to delete question. Please try again.");
        });
    }
  };


  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4>Manage Questions</h4>
        <Link to="/create-question" className="btn btn-primary">Create Questions</Link>
      </div>

      <div className="card-body">
        {/* Filters */}
        <div className="row my-3 mb-5">
          {/* Exam */}
          <div className="col-md-4">
            <label className="form-label">Select Exam</label>
            <select className="form-select" value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
              <option value="">Choose Exam</option>
              {exams?.map((exam) => (
                <option key={exam._id} value={exam._id}>{exam.name}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="col-md-4">
            <label className="form-label">Select Subject</label>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedExam}
            >
              <option value="">Choose Subject</option>
              {subjects?.map((subj) => (
                <option key={subj._id} value={subj._id}>{subj.name}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div className="col-md-4">
            <label className="form-label">Select Topic</label>
            <select
              className="form-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedSubject}
            >
              <option value="">Choose Topic</option>
              {topics?.filter(t => t.subject._id === selectedSubject).map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="text-center"><Spinner animation="border" /></div>}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && questions.length === 0 && selectedTopic && <p>No questions found for the selected topic.</p>}

        {!loading && questions.length > 0 && (
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q._id}>
                  <td>{i + 1}</td>
                  <td>{q.questionText || q.text}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(q)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(q._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      <Modal size="lg" show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Exam */}
            <Form.Group className="mb-3">
              <Form.Label>Exam</Form.Label>
              <Form.Select name="exam" value={editForm.exam} onChange={handleEditFormChange}>
                <option value="">Select Exam</option>
                {exams.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
              </Form.Select>
            </Form.Group>

            {/* Subject */}
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select name="subject" value={editForm.subject} onChange={handleEditFormChange}>
                <option value="">Select Subject</option>
                {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </Form.Select>
            </Form.Group>

            {/* Topic */}
            <Form.Group className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Select name="topic" value={editForm.topic} onChange={handleEditFormChange}>
                <option value="">Select Topic</option>
                {topics.filter((t) => t.subject._id === editForm.subject).map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Question Text */}
            <Form.Group className="mb-3">
              <Form.Label>Question Text</Form.Label>
              <Form.Control
                as="textarea"
                name="questionText"
                value={editForm.questionText}
                onChange={handleEditFormChange}
                rows={3}
              />
            </Form.Group>

            {/* Options */}
            {editForm.options.map((opt, idx) => (
              <Form.Group key={idx} className="mb-2 d-flex align-items-center">
                <Form.Control
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                />
                {editForm.options.length > 2 && (
                  <Button variant="danger" size="sm" onClick={() => removeOption(idx)} className="ms-2">X</Button>
                )}
              </Form.Group>
            ))}
            <Button variant="secondary" size="sm" onClick={addOption}>Add Option</Button>

            {/* Correct Answer */}
            <Form.Group className="my-3">
              <Form.Label>Correct Answer Index</Form.Label>
              <Form.Select
                name="correctAnswerIndex"
                value={editForm.correctAnswerIndex}
                onChange={handleEditFormChange}
              >
                <option value="">Select Correct Option</option>
                {editForm.options.map((_, idx) => (
                  <option key={idx} value={idx}>{`Option ${idx + 1}`}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Explanation */}
            <Form.Group className="mb-3">
              <Form.Label>Explanation (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="explanation"
                value={editForm.explanation}
                onChange={handleEditFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
