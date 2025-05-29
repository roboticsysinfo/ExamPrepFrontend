import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateSubjectForm from "../components/CreateSubjectForm";


const CreateSubjectPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title='Create Subject' />

                <CreateSubjectForm />

            </MasterLayout>
        </>
    );
};

export default CreateSubjectPage;
