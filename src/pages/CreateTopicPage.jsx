import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateTopicForm from "../components/CreateTopicForm";


const CreateTopicPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Create Topic" />

                <CreateTopicForm />

            </MasterLayout>
        </>
    );
};

export default CreateTopicPage;
