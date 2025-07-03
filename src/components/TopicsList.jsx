import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTopics, deleteTopic, updateTopic, getTopicsByInstituteId } from '../redux/slices/topicSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { getSubjectsByInstituteId } from '../redux/slices/subjectSlice';


const TopicsList = () => {
  const dispatch = useDispatch();

  // Getting topics & subjects from Redux store
  const { topics, loading, error } = useSelector((state) => state.topics);
  const { subjects } = useSelector((state) => state.subject);  // assuming you have this slice
  const { user } = useSelector((state) => state.auth.user);
  const instituteId = user?.instituteId;

  console.log("subjects", subjects);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [showModal, setShowModal] = useState(false);


  // Fetch Topics on mount
  useEffect(() => {
    dispatch(getTopicsByInstituteId(instituteId));
    dispatch(getSubjectsByInstituteId(instituteId));
  }, [dispatch]);

  // Open Edit Modal and prefill title and subject
  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setUpdatedTitle(topic.name || topic.title || '');

    // Preselect the subject id if available
    setSelectedSubjectId(topic.subject?._id || '');

    setShowModal(true);
  };

  // Close modal and clear states
  const handleClose = () => {
    setShowModal(false);
    setSelectedTopic(null);
    setUpdatedTitle('');
    setSelectedSubjectId('');
  };

  // Submit update with title and subject id
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
      const result = await dispatch(updateTopic({
        id: selectedTopic._id,
        updatedData: {
          name: updatedTitle,
          subject: selectedSubjectId,
          instituteId: instituteId
        }
      }));

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Topic updated successfully.");
        dispatch(getTopicsByInstituteId(instituteId)); // ✅ Refresh topics
      } else {
        toast.error("Failed to update topic.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }

    handleClose(); // ✅ Modal close
  };




  // Delete topic
  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this topic?');
    if (confirmed) {
      dispatch(deleteTopic(id))
        .unwrap()
        .then(() => {
          toast.success("Topic deleted successfully.");
        })
        .catch(() => {
          toast.error("Failed to delete topic. Please try again.");
        });
    }
  };

  return (
    <div className="card basic-data-table">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0">All Topics</h5>
        <Link to="/create-topic" className="btn btn-primary">
          Create Topic
        </Link>
      </div>
      <div className="card-body">
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !topics.length && <p>No topics found.</p>}

        {!loading && topics.length > 0 && (
          <table className="table bordered-table mb-0">
            <thead>
              <tr>
                <th>S.L</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, index) => (
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

      {/* React Bootstrap Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

          <div>
            <label className="form-label">Subject</label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects && subjects.map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.name}
                </option>
              ))}
            </select>
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
