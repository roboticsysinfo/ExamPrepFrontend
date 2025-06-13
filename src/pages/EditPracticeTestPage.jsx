import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditPracticeTestForm from "../components/EditPracticeTestForm";


const EditPracticeTestPage = () => {

    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Edit Practice Test" />

                <EditPracticeTestForm />

            </MasterLayout>
        </>
    );

};

export default EditPracticeTestPage;
