import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RegisterInstituteForm from "../components/RegisterInstituteForm";


const RegisterInstitutePage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Register Institute" />

                <RegisterInstituteForm />

            </MasterLayout>
        </>
    );
};

export default RegisterInstitutePage;
