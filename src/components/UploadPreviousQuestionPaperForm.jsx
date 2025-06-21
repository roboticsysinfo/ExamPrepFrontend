import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExamsByInstituteId } from '../redux/slices/examSlice';
import { getSubjectsByExamId } from '../redux/slices/subjectSlice';
import { uploadPreviousQuestionPaper, clearMessages } from '../redux/slices/previousQuestionPaperSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UploadPreviousQuestionPaperForm() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth.user);
  const instituteId = user?.instituteId;

  const { exams, loading: examsLoading } = useSelector((state) => state.exam);
  const { subjects, loading: subjectsLoading } = useSelector((state) => state.subject);
  const { loading: uploadLoading, error: uploadError, successMessage } = useSelector((state) => state.previousQuestionPaper);

  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [year, setYear] = useState('');

  useEffect(() => {
    if (instituteId) {
      dispatch(getExamsByInstituteId(instituteId));
    }
  }, [dispatch, instituteId]);

  useEffect(() => {
    if (selectedExamId) {
      dispatch(getSubjectsByExamId(selectedExamId));
    }
  }, [dispatch, selectedExamId]);

  useEffect(() => {
    if (uploadError) toast.error(uploadError);
    if (successMessage) toast.success(successMessage);

    return () => {
      dispatch(clearMessages());
    };
  }, [uploadError, successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedExamId || !selectedSubjectId || !title || !file || !year) {
      toast.error('Please fill all fields, year, and select a file.');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB


    if (file.size > maxSizeInBytes) {
      toast.error(`File is too large. (${(file.size / 1024).toFixed(2)} KB). Must be <= 1 MB.`);
      return;
    }

    const formData = new FormData();
    formData.append('instituteId', instituteId);
    formData.append('examId', selectedExamId);
    formData.append('subjectId', selectedSubjectId);
    formData.append('title', title);
    formData.append('file', file);
    formData.append('year', Number(year)); // ✅ Number type

    dispatch(uploadPreviousQuestionPaper(formData));
  };


  return (
    <div className="card mt-4 p-4">
      <h4 className="mb-4">Upload Previous Question Paper</h4>
      <hr />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className='p-5'>
        {/* Exam Dropdown */}
        <div className="mb-3">
          <label htmlFor="exam" className="form-label">Select Exam</label>
          <select
            id="exam"
            className="form-select"
            value={selectedExamId}
            onChange={(e) => {
              setSelectedExamId(e.target.value);
              setSelectedSubjectId('');
            }}
            disabled={examsLoading || !instituteId}
            required
          >
            <option value="">-- Select Exam --</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>{exam.name}</option>
            ))}
          </select>
          {examsLoading && <div className="form-text">Loading exams...</div>}
        </div>

        {/* Subject Dropdown */}
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">Select Subject</label>
          <select
            id="subject"
            className="form-select"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            disabled={!selectedExamId || subjectsLoading}
            required
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>{subject.name}</option>
            ))}
          </select>
          {subjectsLoading && <div className="form-text">Loading subjects...</div>}
        </div>

        {/* Title Input */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Paper Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Math Paper 2023"
            required
          />
        </div>

        {/* Year Input */}
        <div className="mb-3">
          <label htmlFor="year" className="form-label">Year</label>
          <input
            type="number"
            className="form-control"
            id="year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            placeholder="E.g. 2023"
            required
          />
        </div>

        {/* File Input */}
        <div className="mb-3">
          <label htmlFor="file" className="form-label">Upload File (PDF, Max 1MB)</label>
          <input
            type="file"
            className="form-control"
            id="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={uploadLoading}>
          {uploadLoading ? 'Uploading...' : 'Upload Paper'}
        </button>
      </form>
    </div>
  );
}
