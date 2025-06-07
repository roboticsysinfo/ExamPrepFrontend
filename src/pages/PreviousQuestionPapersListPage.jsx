import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PreviousQuestionPapersList from "../components/PreviousQuestionPapersList";


const PreviousQuestionPapersListPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Previous Question Papers" />

                <PreviousQuestionPapersList />

            </MasterLayout>
        </>
    );
};

export default PreviousQuestionPapersListPage;
