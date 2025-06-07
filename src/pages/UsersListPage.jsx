import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UsersList from "../components/UsersList";


const UsersListPage = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Users List" />

                <UsersList />

            </MasterLayout>
        </>
    );
};

export default UsersListPage;
