import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerSix from "../components/DashBoardLayerSix";


const HomePageSix = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Dashboard" />

        {/* DashBoardLayerSix */}
        <DashBoardLayerSix />

      </MasterLayout>
    </>
  );
};

export default HomePageSix;
