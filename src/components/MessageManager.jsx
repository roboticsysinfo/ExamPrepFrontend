import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../redux/slices/adminMessageSlice";
import { toast } from "react-toastify";

const MessageManager = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.adminMessages);

  const [form, setForm] = useState({ id: null, title: "", body: "" });

  useEffect(() => {
    dispatch(getAllMessages());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await dispatch(
          updateMessage({ id: form.id, title: form.title, body: form.body })
        ).unwrap();
        toast.success("✅ Message updated successfully");
      } else {
        await dispatch(
          createMessage({ title: form.title, body: form.body })
        ).unwrap();
        toast.success("📢 Message created & sent successfully");
      }
      setForm({ id: null, title: "", body: "" });
    } catch (err) {
      toast.error("❌ Something went wrong");
    }
  };

  const handleEdit = (msg) => {
    setForm({ id: msg._id, title: msg.title, body: msg.body });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await dispatch(deleteMessage(id)).unwrap();
        toast.info("🗑️ Message deleted");
      } catch (err) {
        toast.error("❌ Failed to delete message");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Message Manager</h5>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#messageModal"
            onClick={() => setForm({ id: null, title: "", body: "" })}
          >
            + New Message
          </button>
        </div>
        <div className="card-body">
          {loading && <p>Loading...</p>}
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Body</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <tr key={msg._id}>
                    <td>{index + 1}</td>
                    <td>{msg.title}</td>
                    <td>{msg.body}</td>
                    <td>{new Date(msg.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#messageModal"
                        onClick={() => handleEdit(msg)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(msg._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="messageModal"
        tabIndex="-1"
        aria-labelledby="messageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="messageModalLabel">
                  {form.id ? "Edit Message" : "New Message"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Body</label>
                  <textarea
                    className="form-control"
                    name="body"
                    rows="3"
                    value={form.body}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {form.id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageManager;
