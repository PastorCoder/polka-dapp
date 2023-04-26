import React from "react";
import { Routes, Route } from "react-router-dom";
import Transfer from "../frames/Transfer";
import Index from "../pages/Index";
import TalismanPage from "../pages/TalismanPage";
// import ErrorPage from "../frames/ErrorPage";

const RoutePages = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Index />} />
      <Route path="transfer-fund" element={<Transfer />} />
      <Route path="talisman" element={<TalismanPage />} />
    </Routes>
  );
};

export default RoutePages;
