import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateQuestionForm from "../components/CreateQuestionForm";


const CreateQuestionPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Create Question" />

                <CreateQuestionForm />

            </MasterLayout>
        </>
    );
};

export default CreateQuestionPage;
