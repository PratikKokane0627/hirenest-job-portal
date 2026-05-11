import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const AppShell = lazy(() => import("./components/AppShell.jsx"));
const Landing = lazy(() => import("./pages/Landing.jsx"));

export default function App() {
  return (
    <Suspense fallback={<div className="route-loader">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </Suspense>
  );
}
