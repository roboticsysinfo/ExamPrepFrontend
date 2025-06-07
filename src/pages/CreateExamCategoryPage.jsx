import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ExamCategoryForm from "../components/ExamCategoryForm";


const CreateExamCategoryPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Create Exam Category" />

                <ExamCategoryForm />

            </MasterLayout>
        </>
    );
};

export default CreateExamCategoryPage;
