import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentRegistrationForm from "../components/StudentRegistrationForm";

const ExamsListPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="All Exams" />

                <StudentRegistrationForm />

            </MasterLayout>
        </>
    );
};

export default ExamsListPage;
