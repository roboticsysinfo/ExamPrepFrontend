import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AdmissionQuery from "../components/AdmissionQuery";


const AdmissionQueryPage = () => {

    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Admission Query" />

                <AdmissionQuery />

            </MasterLayout>
        </>
    );

};

export default AdmissionQueryPage;
