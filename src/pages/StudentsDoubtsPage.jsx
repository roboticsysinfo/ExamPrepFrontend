import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import QuestionDoubts from "../components/QuestionDoubts";


const StudentsDoubtsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Students Doubts" />

        <QuestionDoubts />


      </MasterLayout>
    </>
  );
};

export default StudentsDoubtsPage;
