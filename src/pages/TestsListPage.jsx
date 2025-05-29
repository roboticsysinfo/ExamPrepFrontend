import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TestsList from "../components/TestsList";


const TestsListPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="All Tests" />

                <TestsList />

            </MasterLayout>
        </>
    );
};

export default TestsListPage;
