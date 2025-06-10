import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoubtsByInstitute, answerDoubt } from '../redux/slices/doubtSlice';

const QuestionDoubts = () => {
    const dispatch = useDispatch();
    const { doubts, loading } = useSelector((state) => state.doubt);
    const [reply, setReply] = useState('');
    const { user } = useSelector((state) => state.auth.user);
    const instituteId = user?.instituteId;
    const userId = user?._id;

    useEffect(() => {
        dispatch(getDoubtsByInstitute(instituteId));
    }, [instituteId]);

    const handleAnswer = (id) => {
        if (reply.trim()) {
            dispatch(answerDoubt({ doubtId: id, answer: reply, answeredBy: userId }));
            setReply('');
        }
    };

    return (
        <div className="container my-4">
            <div className='card mb-5'>
                <div className='card-header'>
                    <h5 className="mb-3 text-start">Student Doubts</h5>
                </div>
            </div>

            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            )}

            {!loading && doubts.length === 0 && (
                <div className="alert alert-info text-center">No doubts found for your institute.</div>
            )}

            <div className="row">
                {doubts.map((d) => (
                    <div key={d._id} className="col-md-6 mb-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <h5 className="card-title mb-2">{d.question}</h5>
                                <ul className="list-unstyled small text-muted mb-3">
                                    <li><strong>Exam:</strong> {d.exam?.name || '-'}</li>
                                    <li><strong>Subject:</strong> {d.subject?.name || '-'}</li>
                                    <li><strong>Topic:</strong> {d.topic?.name || '-'}</li>
                                    <li><strong>Status:</strong> 
                                        <span className={`badge ms-2 ${d.status === 'answered' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                            {d.status}
                                        </span>
                                    </li>
                                </ul>

                                {d.status === 'answered' ? (
                                    <div className="alert alert-success p-2 mb-0">
                                        <strong>Answer:</strong> {d.answer}
                                    </div>
                                ) : (
                                    <div>
                                        <textarea
                                            className="form-control mb-2"
                                            rows={3}
                                            placeholder="Type your answer..."
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleAnswer(d._id)}
                                            className="btn btn-sm btn-primary"
                                        >
                                            Submit Answer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionDoubts;
