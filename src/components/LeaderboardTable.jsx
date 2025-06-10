import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaderboard } from '../redux/slices/studentSlice';
import { Spinner, Button } from 'react-bootstrap';

const LeaderboardTable = () => {
  const dispatch = useDispatch();
  const { leaderboard, loading } = useSelector(state => state.student);

  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    dispatch(getLeaderboard({ page, limit }));
  }, [dispatch, page]);

  const handlePrev = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (leaderboard.pagination?.hasNextPage) setPage(prev => prev + 1);
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-3">🏆 Leaderboard</h5>
      <hr />

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Rank</th>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Overall Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard?.students?.length > 0 ? (
                  leaderboard.students.map((student, index) => (
                    <tr key={student._id}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>
                        <img
                          src={
                            student.profileImage &&
                            !student.profileImage.startsWith('file://')
                              ? `${process.env.REACT_APP_UPLOADS_URL}/${student.profileImage}`
                              : '/default-avatar.png'
                          }
                          alt={student.name}
                          className="rounded-circle"
                          width="40"
                          height="40"
                          style={{ objectFit: 'cover' }}
                        />
                      </td>
                      <td>{student.name}</td>
                      <td>{student.overallScore}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={page === 1 || loading}
            >
              ◀ Previous
            </Button>
            <span>
              Page {leaderboard.pagination?.page} of{' '}
              {leaderboard.pagination?.totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={!leaderboard.pagination?.hasNextPage || loading}
            >
              Next ▶
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardTable;
