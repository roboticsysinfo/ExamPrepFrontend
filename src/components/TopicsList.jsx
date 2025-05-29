import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTopics, deleteTopic, updateTopic } from '../redux/slices/topicSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const TopicsList = () => {
  const dispatch = useDispatch();
  const { topics, loading, error } = useSelector((state) => state.topics);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');

  // Fetch Topics
  useEffect(() => {
    dispatch(getAllTopics());
  }, [dispatch]);

  // Open Edit Modal
  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setUpdatedTitle(topic.title);
    // Show Bootstrap modal manually
    const modal = new window.bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  };

  // Submit Update
  const handleUpdate = () => {
    if (!updatedTitle.trim()) {
      alert('Title cannot be empty!');
      return;
    }
    dispatch(updateTopic({ id: selectedTopic._id, updatedData: { title: updatedTitle } }));
    // Hide modal
    const modalEl = document.getElementById('editModal');
    const modal = window.bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  };

  // Handle Delete
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
      <div className="card-header d-flex  align-items-center justify-content-between">
        <h5 className="card-title mb-0">All Topics</h5>

        <Link to="/create-topic" className='btn btn-primary'>
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

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Edit Topic
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsList;
