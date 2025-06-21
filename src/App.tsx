import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <h1>Willkommen bei doesinger-app</h1>;
}

function NotFound() {
  return <h1>404 – Seite nicht gefunden</h1>;
}

export default function App() {
  return (
    <BrowserRouter basename="/doesinger-app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

