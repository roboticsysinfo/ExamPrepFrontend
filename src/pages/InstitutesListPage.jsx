import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import InstitutesList from "../components/InstitutesList";


const InstitutesListPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Institutes" />

                <InstitutesList />

            </MasterLayout>
        </>
    );
};

export default InstitutesListPage;
