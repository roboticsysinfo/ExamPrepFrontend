import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateExamForm from "../components/CreateExamForm";


const CreateExamPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Create Exam" />

                <CreateExamForm />

            </MasterLayout>
        </>
    );
};

export default CreateExamPage;
