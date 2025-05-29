import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentUpdateForm from "../components/StudentUpdateForm";


const StudentUpdatePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Update Student Information" />

        <StudentUpdateForm />


      </MasterLayout>
    </>
  );
};

export default StudentUpdatePage;
