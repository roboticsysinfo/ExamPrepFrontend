import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTopicsBySubjectId,
  deleteTopic,
  updateTopic,
} from '../redux/slices/topicSlice';
import { getExamsByInstituteId } from '../redux/slices/examSlice';
import { getSubjectsByExamId } from '../redux/slices/subjectSlice';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TopicsList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { topics, loading, error } = useSelector((state) => state.topics);
  const { subjects } = useSelector((state) => state.subject);
  const { exams } = useSelector((state) => state.exam);
  const { user } = useSelector((state) => state.auth.user);
  const instituteId = user?.instituteId;

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDetail, setUpdatedDetail] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (instituteId) {
      dispatch(getExamsByInstituteId(instituteId));
    }
  }, [instituteId]);

  useEffect(() => {
    if (selectedExam) {
      dispatch(getSubjectsByExamId(selectedExam));
    }
  }, [selectedExam]);

  useEffect(() => {
    if (selectedSubjectId) {
      dispatch(getTopicsBySubjectId(selectedSubjectId));
    }
  }, [selectedSubjectId]);

  // Reset filters when returning to the page
  useEffect(() => {
    setSelectedExam('');
    setSelectedSubjectId('');
    setSearchText('');
    dispatch({ type: 'topics/clearTopics' }); // 👈 optional if your slice supports this
  }, []);

  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setUpdatedTitle(topic.name || '');
    setUpdatedDetail(topic.topicDetail || '');
    setSelectedSubjectId(topic.subject?._id || '');
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedTopic(null);
    setUpdatedTitle('');
    setUpdatedDetail('');
    setSelectedSubjectId('');
  };

  const handleUpdate = async () => {
    if (!updatedTitle.trim()) {
      alert('Title cannot be empty!');
      return;
    }
    if (!selectedSubjectId) {
      alert('Please select a subject!');
      return;
    }

    try {
      const result = await dispatch(
        updateTopic({
          id: selectedTopic._id,
          updatedData: {
            name: updatedTitle,
            topicDetail: updatedDetail,
            subject: selectedSubjectId,
            instituteId: instituteId,
          },
        })
      );

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Topic updated successfully.');
        dispatch(getTopicsBySubjectId(selectedSubjectId));
      } else {
        toast.error('Failed to update topic.');
      }
    } catch {
      toast.error('Something went wrong.');
    }

    handleClose();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this topic?');
    if (confirmed) {
      dispatch(deleteTopic(id))
        .unwrap()
        .then(() => {
          toast.success('Topic deleted successfully.');
          dispatch(getTopicsBySubjectId(selectedSubjectId));
        })
        .catch(() => {
          toast.error('Failed to delete topic. Please try again.');
        });
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
  ];

  return (
    <div className="card basic-data-table">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0">All Topics</h5>
        <Link to="/create-topic" className="btn btn-primary">
          Create Topic
        </Link>
      </div>

      <div className="card-body">
        <div className="row mb-40">
          <div className="col-md-4">
            <label>Exam</label>
            <select
              className="form-select"
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value);
                setSelectedSubjectId('');
              }}
            >
              <option value="">Select Exam</option>
              {exams?.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label>Subject</label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={!selectedExam}
            >
              <option value="">Select Subject</option>
              {subjects?.map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label>Search Topic</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by topic name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              disabled={!topics.length}
            />
          </div>
        </div>

        <hr />

        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !filteredTopics.length && <p>No topics found.</p>}

        {!loading && filteredTopics.length > 0 && (
          <table className="table bordered-table mt-20 mb-0">
            <thead>
              <tr>
                <th>S.L</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic, index) => (
                <tr key={topic._id}>
                  <td>{index + 1}</td>
                  <td>{topic.name}</td>
                  <td>{topic.subject?.name}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(topic)}
                      className="btn btn-sm btn-success me-2"
                      title="Edit Topic"
                    >
                      <Icon icon="lucide:edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic._id)}
                      className="btn btn-sm btn-danger"
                      title="Delete Topic"
                    >
                      <Icon icon="mingcute:delete-2-line" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Topic</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Subject</label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects?.map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Topic Detail</label>
            <div style={{ height: '200px', overflowY: 'auto' }}>
              <ReactQuill
                value={updatedDetail}
                onChange={setUpdatedDetail}
                theme="snow"
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '150px' }}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TopicsList;
