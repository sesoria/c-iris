import "./styles.scss";
import React, { useState } from "react";
import Layout from "./components/layouts/Layout";
import Header from "./components/header/Header";
import SideMenu from "./components/sidemenu/SideMenu";
import Home from "./components/home/Home";
import StreamingPage from "./components/streaming/StreamingPage";
import { Routes, Route, Navigate } from 'react-router-dom';
import { faChartPie, faChartLine } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [menuExpanded, setMenuExpanded] = useState(true);  // Estado para el sidebar
  const menuItems = [
    {
      icon: faChartPie,
      title: "Opt1",
      items: ["op1", "op2"],
      onClick: (item) => alert(`Click on ${item}`),
    },
    {
      icon: faChartLine,
      title: "Opt2",
      items: ["op3", "op4"],
      onClick: (item) => alert(`Click on ${item}`),
    },
  ];

  // Función toggle que cambia el estado de visibilidad del sidebar
  const toggleSidebar = () => {
    setMenuExpanded(!menuExpanded);
  };

  return (
    <Layout>
      <Header toggleSidebar={toggleSidebar} />
      <SideMenu menuItems={menuItems} setMenuExpanded={setMenuExpanded} menuExpanded={menuExpanded} />
      <Routes>
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="streams/:streamId" element={<StreamingPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
