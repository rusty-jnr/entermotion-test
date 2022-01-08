import React from "react";
import { Route, Routes } from "react-router-dom";
import Authorization from "../pages/authorization";

const RoutePaths = () => (
  <Routes>
    <Route exact path="/" element={<Authorization />} />
  </Routes>
);

export default RoutePaths;
