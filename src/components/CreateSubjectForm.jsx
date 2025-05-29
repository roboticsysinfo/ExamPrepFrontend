import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createSubject,
  getAllSubjects,
} from '../redux/slices/subjectSlice';
import { getAllExams } from '../redux/slices/examSlice';

const CreateSubjectForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [exam, setExam] = useState('');

  // Get exams list from redux
  const { exams } = useSelector((state) => state.exam);
  const { loading } = useSelector((state) => state.subject);

  // Load exams on component mount
  useEffect(() => {
    dispatch(getAllExams());
  }, [dispatch]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !exam) {
      toast.error('Both subject name and exam are required');
      return;
    }

    try {
      await dispatch(createSubject({ name, exam })).unwrap();
      dispatch(getAllSubjects()); // Refresh subject list
      toast.success('Subject created successfully!');
      navigate('/subjects'); // Navigate to subject list
    } catch (err) {
      toast.error(err?.message || 'Failed to create subject');
    }
  };

  return (

    <Card className="mt-4 shadow-sm">
      <Card.Body>
        <Card.Title>Create New Subject</Card.Title>

        <div className='row justify-content-center'>

          <div className='col-lg-6 col-xs-12 col-sm-12'>

            <Form onSubmit={handleSubmit} className='my-5'>
              <Form.Group className="mb-3">
                <Form.Label>Subject Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subject name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Exam</Form.Label>
                <Form.Select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  required
                >
                  <option value="">-- Select Exam --</option>
                  {exams?.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" disabled={loading} className='mt-3'>
                {loading ? <Spinner size="sm" animation="border" /> : 'Create Subject'}
              </Button>
            </Form>

          </div>

        </div>

      </Card.Body>
    </Card>
  );
};

export default CreateSubjectForm;
