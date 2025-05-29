import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentById } from '../redux/slices/studentSlice';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const StudentProfile = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const { student, loading, error } = useSelector((state) => state.student);


    useEffect(() => {
        if (id) {
            dispatch(getStudentById(id));
        }
    }, [dispatch, id]);

    if (loading) return <div className="text-center py-4"><Spinner variant='blue' /></div>;
    if (error) return <div className="text-danger text-center py-4">{error}</div>;


    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title">Student Profile</h5>
            </div>
            <div className="card-body">
                <div className="d-flex align-items-center gap-4 mb-4">
                    <img
                        src={
                            student?.profileImage
                                ? `${process.env.REACT_APP_UPLOADS_URL}/${student.profileImage}`
                                : "https://dummyimage.com/150x150/cccccc/000000&text=Profile"
                        }
                        alt={student?.name}
                        width="100"
                        height="100"
                        className="radius-12"
                    />
                    <h4>{student?.name}</h4>
                </div>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Registration Number</th>
                            <td>{student?.registrationNumber}</td>
                        </tr>
                        <tr>
                            <th>Father's Name</th>
                            <td>{student?.fatherName}</td>
                        </tr>
                        <tr>
                            <th>Mother's Name</th>
                            <td>{student?.motherName}</td>
                        </tr>
                        <tr>
                            <th>Date of Birth</th>
                            <td>{new Date(student?.dob).toLocaleDateString('en-IN')}</td>
                        </tr>
                        <tr>
                            <th>Gender</th>
                            <td>{student?.gender}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td>{student?.phoneNumber}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{student?.email}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{student?.address}</td>
                        </tr>
                        <tr>
                            <th>Village</th>
                            <td>{student?.village}</td>
                        </tr>
                        <tr>
                            <th>City</th>
                            <td>{student?.city}</td>
                        </tr>
                        <tr>
                            <th>State</th>
                            <td>{student?.state}</td>
                        </tr>
                        <tr>
                            <th>Join Date</th>
                            <td>{new Date(student?.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentProfile;
