import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UpdateExamForm from "../components/UpdateExamForm";


const UpdateExamPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Create Exam" />

                <UpdateExamForm />

            </MasterLayout>
        </>
    );
};

export default UpdateExamPage;
