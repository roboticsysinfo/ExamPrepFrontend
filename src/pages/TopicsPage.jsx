import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TopicsList from "../components/TopicsList";


const TopicsPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Topics" />

                <TopicsList />


            </MasterLayout>
        </>
    );
};

export default TopicsPage;
