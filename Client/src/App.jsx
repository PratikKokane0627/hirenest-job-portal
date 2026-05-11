import React from "react";
import { Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import Landing from "./pages/Landing.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  );
}
