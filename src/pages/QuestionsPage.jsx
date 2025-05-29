import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import QuestionManager from "../components/QuestionManager";


const QuestionsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Questions" />

        <QuestionManager />

      </MasterLayout>
    </>
  );
};

export default QuestionsPage;
