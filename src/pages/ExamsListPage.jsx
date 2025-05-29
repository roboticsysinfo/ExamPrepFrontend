import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ExamsList from "../components/ExamsList";


const ExamsListPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="All Exams" />

                <ExamsList />

            </MasterLayout>
        </>
    );
};

export default ExamsListPage;
