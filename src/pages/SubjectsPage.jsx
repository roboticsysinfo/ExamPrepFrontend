import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SubjectsList from "../components/SubjectsList";


const SubjectsPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title='Subjects' />

                <SubjectsList />

            </MasterLayout>
        </>
    );
};

export default SubjectsPage;
