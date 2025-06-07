import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PracticeTestsList from "../components/PracticeTestsList";


const PracticeTestsListPage = () => {

    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Practice Tests" />

                <PracticeTestsList />

            </MasterLayout>
        </>
    );

};

export default PracticeTestsListPage;
