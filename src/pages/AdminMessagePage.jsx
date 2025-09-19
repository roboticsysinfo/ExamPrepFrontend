import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import MessageManager from "../components/MessageManager";


const AdminMessagePage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Manage Messages" />

                <MessageManager />


            </MasterLayout>
        </>
    );
};

export default AdminMessagePage;
