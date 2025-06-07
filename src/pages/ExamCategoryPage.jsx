import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ExamCategoriesList from "../components/ExamCategoriesList";


const ExamCategoryPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Exam Categories" />

                <ExamCategoriesList />

            </MasterLayout>
        </>
    );
};

export default ExamCategoryPage;
