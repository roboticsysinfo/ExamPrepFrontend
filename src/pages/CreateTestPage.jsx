import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateTestForm from "../components/CreateTestForm";


const CreateTestPage = () => {

    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Create Test" />

                <CreateTestForm />

            </MasterLayout>
        </>
    );
    
};

export default CreateTestPage;
