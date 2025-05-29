import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentProfile from "../components/StudentProfile";


const StudentProfilePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Student Profile" />

        {/* FaqLayer */}
        <StudentProfile />


      </MasterLayout>
    </>
  );
};

export default StudentProfilePage;
