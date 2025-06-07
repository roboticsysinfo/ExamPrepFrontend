import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UploadPreviousQuestionPaperForm from "../components/UploadPreviousQuestionPaperForm";


const UploadQuestionPaper = () => {

    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Upload Previous Question Paper" />

                <UploadPreviousQuestionPaperForm />

            </MasterLayout>
        </>
    );

};

export default UploadQuestionPaper;
