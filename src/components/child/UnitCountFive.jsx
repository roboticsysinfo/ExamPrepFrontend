import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentsByInstituteId } from '../../redux/slices/studentSlice';

const UnitCountFive = () => {
  const dispatch = useDispatch();
  
   const {user} = useSelector(state => state.auth.user);
  const studentCount = useSelector(state => state.student.instituteStudents.length);
    const instituteId = user?.instituteId


  useEffect(() => {
    if (instituteId) {
      dispatch(getStudentsByInstituteId(instituteId));
    }
  }, [dispatch, instituteId]);


  return (
    <div className="col-xxl-8">
      <div className="card radius-8 border-0 p-20">
        <div className="row gy-4">

          <div className="col-lg-4">

            <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-1 mb-12">
              <div className="card-body p-0">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                  <div className="d-flex align-items-center gap-2 mb-12">
                    <span className="mb-0 w-48-px h-48-px bg-base text-pink text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                      <i className="ri-group-fill" />
                    </span>
                    <div>
                      <span className="mb-0 fw-medium text-secondary-light text-lg">
                        Total Students
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                  <h5 className="fw-semibold mb-0">{studentCount}</h5>
                </div>
              </div>
            </div>

            {/* ... other cards (courses, revenue) unchanged ... */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountFive;
