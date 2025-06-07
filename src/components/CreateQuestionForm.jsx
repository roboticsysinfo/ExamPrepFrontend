import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExamsByInstituteId } from '../redux/slices/examSlice';
import { getSubjectsByExamId } from '../redux/slices/subjectSlice';
import { getTopicsByInstituteId, getTopicsBySubjectId } from '../redux/slices/topicSlice';
import { bulkCreateQuestions } from '../redux/slices/questionSlice';
import { toast } from 'react-toastify';

const CreateQuestionForm = () => {
    const dispatch = useDispatch();
    const { exams } = useSelector((state) => state.exam);
    // Removed direct topics from global state because we handle topics per subject locally
    const { user } = useSelector((state) => state.auth.user);

    const [formData, setFormData] = useState([]);
    const [subjectsMap, setSubjectsMap] = useState({});
    const [topicsMap, setTopicsMap] = useState({});

    useEffect(() => {
        if (user?.instituteId) {
            dispatch(getExamsByInstituteId(user.instituteId));
            dispatch(getTopicsByInstituteId(user.instituteId)); // You can remove if not needed
            setFormData([
                getNewQuestion(user.instituteId)
            ]);
        }
    }, [dispatch, user?.instituteId]);

    const getNewQuestion = (instituteId) => ({
        exam: '', subject: '', topic: '',
        questionText: '', options: ['', ''],
        correctAnswerIndex: '', explanation: '',
        difficulty: '', instituteId
    });

    const fetchSubjects = async (examId) => {
        try {
            const action = await dispatch(getSubjectsByExamId(examId));
            if (getSubjectsByExamId.fulfilled.match(action)) {
                return action.payload || [];
            } else {
                toast.error('Failed to load subjects');
                return [];
            }
        } catch {
            toast.error('Error fetching subjects');
            return [];
        }
    };

    const fetchTopics = async (subjectId) => {
        try {
            const action = await dispatch(getTopicsBySubjectId(subjectId));
            if (getTopicsBySubjectId.fulfilled.match(action)) {
                return action.payload || [];
            } else {
                toast.error('Failed to load topics');
                return [];
            }
        } catch {
            toast.error('Error fetching topics');
            return [];
        }
    };

    const handleFieldChange = async (index, name, value) => {
        const updated = [...formData];
        updated[index][name] = value;

        if (name === 'exam') {
            // reset subject & topic when exam changes
            updated[index].subject = '';
            updated[index].topic = '';
            const subs = await fetchSubjects(value);
            setSubjectsMap((prev) => ({ ...prev, [index]: subs }));
            setTopicsMap((prev) => ({ ...prev, [index]: [] })); // clear topics for this question
        }

        if (name === 'subject') {
            // reset topic when subject changes
            updated[index].topic = '';
            const tops = await fetchTopics(value);
            setTopicsMap((prev) => ({ ...prev, [index]: tops }));
        }

        setFormData(updated);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...formData];
        updated[qIndex].options[oIndex] = value;
        setFormData(updated);
    };

    const addOption = (qIndex) => {
        const updated = [...formData];
        if (updated[qIndex].options.length < 6) {
            updated[qIndex].options.push('');
            setFormData(updated);
        }
    };

    const removeOption = (qIndex, oIndex) => {
        const updated = [...formData];
        updated[qIndex].options.splice(oIndex, 1);
        updated[qIndex].correctAnswerIndex = '';
        setFormData(updated);
    };

    const addQuestion = () => {
        setFormData((prev) => [...prev, getNewQuestion(user.instituteId)]);
    };

    const removeQuestion = (index) => {
        const updated = [...formData];
        updated.splice(index, 1);
        setFormData(updated);
        const subjectMap = { ...subjectsMap };
        delete subjectMap[index];
        setSubjectsMap(subjectMap);

        const topicMap = { ...topicsMap };
        delete topicMap[index];
        setTopicsMap(topicMap);
    };

    const isValid = () => {
        return formData.every(q => {
            const filledOpts = q.options.filter(opt => opt.trim() !== '');
            return q.exam && q.subject && q.topic && q.questionText.trim() &&
                filledOpts.length >= 2 && q.correctAnswerIndex !== '' &&
                q.correctAnswerIndex >= 0 && q.correctAnswerIndex < filledOpts.length &&
                q.difficulty && q.instituteId;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid()) {
            toast.error('Fill all required fields correctly');
            return;
        }

        try {
            await dispatch(bulkCreateQuestions(formData)).unwrap();
            toast.success('Questions created!');
            setFormData([getNewQuestion(user.instituteId)]);
            setSubjectsMap({});
            setTopicsMap({});
        } catch (err) {
            toast.error('Submit failed: ' + err);
        }
    };

    return (
        <div className="container py-4">
            <form onSubmit={handleSubmit}>
                {formData.map((q, idx) => (
                    <div className="card mb-4 shadow-sm" key={idx}>
                        <div className="card-header d-flex justify-content-between">
                            <h5>Q{idx + 1}</h5>
                            {formData.length > 1 && (
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(idx)}>
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label className="form-label">Exam</label>
                                    <select className="form-select" value={q.exam} onChange={(e) => handleFieldChange(idx, 'exam', e.target.value)}>
                                        <option value=''>Select Exam</option>
                                        {exams?.map((ex) => <option key={ex._id} value={ex._id}>{ex.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Subject</label>
                                    <select className="form-select" value={q.subject} onChange={(e) => handleFieldChange(idx, 'subject', e.target.value)} disabled={!subjectsMap[idx]}>
                                        <option value=''>Select Subject</option>
                                        {subjectsMap[idx]?.map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Topic</label>
                                    <select className="form-select" value={q.topic} onChange={(e) => handleFieldChange(idx, 'topic', e.target.value)} disabled={!topicsMap[idx]}>
                                        <option value=''>Select Topic</option>
                                        {topicsMap[idx]?.map((top) => <option key={top._id} value={top._id}>{top.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Difficulty</label>
                                    <select className="form-select" value={q.difficulty} onChange={(e) => handleFieldChange(idx, 'difficulty', e.target.value)}>
                                        <option value=''>Select Difficulty</option>
                                        <option value='easy'>Easy</option>
                                        <option value='medium'>Medium</option>
                                        <option value='hard'>Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Question</label>
                                <textarea className="form-control" rows={3} value={q.questionText} onChange={(e) => handleFieldChange(idx, 'questionText', e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Options</label>
                                {q.options.map((opt, oIdx) => (
                                    <div className="input-group mb-2" key={oIdx}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={opt}
                                            placeholder={`Option ${oIdx + 1}`}
                                            onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                                        />
                                        {q.options.length > 2 && (
                                            <button className="btn btn-outline-danger" type="button" onClick={() => removeOption(idx, oIdx)}>Remove</button>
                                        )}
                                    </div>
                                ))}
                                {q.options.length < 6 && (
                                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => addOption(idx)}>Add Option</button>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Correct Answer</label>
                                <select className="form-select" value={q.correctAnswerIndex} onChange={(e) => handleFieldChange(idx, 'correctAnswerIndex', e.target.value)}>
                                    <option value=''>Select Answer</option>
                                    {q.options.map((opt, oIdx) => opt.trim() && (
                                        <option key={oIdx} value={oIdx}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Explanation</label>
                                <textarea className="form-control" rows={2} value={q.explanation} onChange={(e) => handleFieldChange(idx, 'explanation', e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="mb-3 d-flex justify-content-between">
                    <button className="btn btn-outline-primary" type="button" onClick={addQuestion}>Add New Question</button>
                    <button className="btn btn-success" type="submit">Submit All</button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuestionForm;
