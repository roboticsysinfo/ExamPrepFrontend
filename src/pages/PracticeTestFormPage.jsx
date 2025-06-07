import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PracticeTestForm from "../components/PracticeTestForm";


const PracticeTestFormPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Create Practice Test" />

                <PracticeTestForm />

            </MasterLayout>
        </>
    );
};

export default PracticeTestFormPage;
