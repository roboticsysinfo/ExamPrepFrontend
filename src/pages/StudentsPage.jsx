import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentsList from "../components/StudentsList";


const StudentsPage = () => {

    return (

        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="All Students" />

                <StudentsList />

            </MasterLayout>

        </>

    );

};


export default StudentsPage;
