import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditTestForm from "../components/EditTestForm";


const EditTestPage = () => {

    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Edit Test" />

                <EditTestForm />

            </MasterLayout>
        </>
    );

};

export default EditTestPage;
