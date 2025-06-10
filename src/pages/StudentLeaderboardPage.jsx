import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import LeaderboardTable from "../components/LeaderboardTable";


const StudentLeaderboardPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Student Leaderboard" />

        <LeaderboardTable />


      </MasterLayout>
    </>
  );
};

export default StudentLeaderboardPage;
