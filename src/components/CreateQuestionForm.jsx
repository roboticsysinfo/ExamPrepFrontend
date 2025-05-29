import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExams } from '../redux/slices/examSlice';
import { getAllSubjects } from '../redux/slices/subjectSlice';
import { getAllTopics } from '../redux/slices/topicSlice';
import { bulkCreateQuestions } from '../redux/slices/questionSlice';
import { toast } from 'react-toastify';

const CreateQuestionForm = () => {

    const dispatch = useDispatch();

    const { exams } = useSelector((state) => state.exam);
    const { subjects } = useSelector((state) => state.subject);
    const { topics } = useSelector((state) => state.topics);

    const [formData, setFormData] = useState([
        {
            exam: '',
            subject: '',
            topic: '',
            questionText: '',
            options: ['', '', '', ''],
            correctAnswerIndex: '',
            explanation: ''
        }
    ]);

    useEffect(() => {
        dispatch(getAllExams());
        dispatch(getAllTopics());
    }, [dispatch]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...formData];
        updated[index][name] = value;
        setFormData(updated);

        if (name === 'exam') {
            dispatch(getAllSubjects(value));
            // reset subject and topic when exam changes
            updated[index].subject = '';
            updated[index].topic = '';
            setFormData([...updated]);
        }
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...formData];
        updated[qIndex].options[optIndex] = value;
        setFormData(updated);
    };

    const addOption = (qIndex) => {
        const updated = [...formData];
        if (updated[qIndex].options.length < 6) {
            updated[qIndex].options.push('');
            setFormData(updated);
        }
    };

    const removeOption = (qIndex, optIndex) => {
        const updated = [...formData];
        updated[qIndex].options.splice(optIndex, 1);
        updated[qIndex].correctAnswerIndex = '';
        setFormData(updated);
    };

    const addNewQuestion = () => {
        setFormData([...formData, {
            exam: '',
            subject: '',
            topic: '',
            questionText: '',
            options: ['', '', '', ''],
            correctAnswerIndex: '',
            explanation: ''
        }]);
    };

    const removeQuestion = (index) => {
        const updated = [...formData];
        updated.splice(index, 1);
        setFormData(updated);
    };

    const validate = () => {
        return formData.every((q) => {
            const filledOptions = q.options.filter((opt) => opt.trim() !== '');
            return (
                q.exam && q.subject && q.topic &&
                q.questionText.trim() &&
                filledOptions.length >= 2 &&
                q.correctAnswerIndex !== '' &&
                q.correctAnswerIndex >= 0 &&
                q.correctAnswerIndex < filledOptions.length
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fill all required fields correctly.");
            return;
        }

        try {
            await dispatch(bulkCreateQuestions(formData)).unwrap();
            toast.success('Questions created successfully!');
            setFormData([
                {
                    exam: '',
                    subject: '',
                    topic: '',
                    questionText: '',
                    options: ['', '', '', ''],
                    correctAnswerIndex: '',
                    explanation: ''
                }
            ]);
        } catch (error) {
            toast.error('Failed to create questions: ' + error);
        }
    };

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                {formData.map((question, index) => (
                    <div key={index} className="card mb-4 shadow">

                        <div className="card-header d-flex justify-content-between">
                            <h5>Question {index + 1}</h5>
                            {formData.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeQuestion(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="card-body">


                            <div className='row d-flex align-items-center justify-content-between'>

                                <div className='col-lg-4'>

                                    {/* Exam */}
                                    <div className="mb-3">
                                        <label className="form-label">Exam</label>
                                        <select
                                            name="exam"
                                            className="form-select"
                                            value={question.exam}
                                            onChange={(e) => handleChange(index, e)}
                                        >
                                            <option value="">Select Exam</option>
                                            {exams?.map((exam) => (
                                                <option key={exam._id} value={exam._id}>{exam.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

                                <div className='col-lg-4'>
                                    {/* Subject */}
                                    <div className="mb-3">
                                        <label className="form-label">Subject</label>
                                        <select
                                            name="subject"
                                            className="form-select"
                                            value={question.subject}
                                            onChange={(e) => handleChange(index, e)}
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects?.map((sub) => (
                                                <option key={sub._id} value={sub._id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='col-lg-4'>
                                    {/* Topic */}
                                    <div className="mb-3">
                                        <label className="form-label">Topic</label>
                                        <select
                                            name="topic"
                                            className="form-select"
                                            value={question.topic}
                                            onChange={(e) => handleChange(index, e)}
                                        >
                                            <option value="">Select Topic</option>
                                            {topics?.map((topic) => (
                                                <option key={topic._id} value={topic._id}>{topic.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>



                            {/* Question Text */}
                            <div className="mb-3">
                                <label className="form-label">Question Text</label>
                                <textarea
                                    className="form-control"
                                    name="questionText"
                                    rows={3}
                                    value={question.questionText}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>

                            {/* Options */}
                            <div className="mb-3">
                                <label className="form-label">Options</label>
                                {question.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="input-group mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Option ${optIdx + 1}`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(index, optIdx, e.target.value)}
                                        />
                                        {question.options.length > 2 && (
                                            <button
                                                className="btn btn-outline-danger"
                                                type="button"
                                                onClick={() => removeOption(index, optIdx)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {question.options.length < 6 && (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        type="button"
                                        onClick={() => addOption(index)}
                                    >
                                        Add Option
                                    </button>
                                )}
                            </div>

                            {/* Correct Answer Dropdown */}
                            <div className="mb-3">
                                <label className="form-label">Correct Answer</label>
                                <select
                                    name="correctAnswerIndex"
                                    className="form-select"
                                    value={question.correctAnswerIndex}
                                    onChange={(e) => handleChange(index, e)}
                                >
                                    <option value="">Select Correct Answer</option>
                                    {question.options
                                        .map((opt, optIdx) => opt.trim() && (
                                            <option key={optIdx} value={optIdx}>
                                                {`Option ${optIdx + 1}: ${opt}`}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Explanation */}
                            <div className="mb-3">
                                <label className="form-label">Explanation</label>
                                <textarea
                                    className="form-control"
                                    name="explanation"
                                    value={question.explanation}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="d-flex gap-3">
                    <button type="button" className="btn btn-primary" onClick={addNewQuestion}>
                        + Add Another Question
                    </button>
                    <button type="submit" className="btn btn-success">
                        Save All
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuestionForm;
