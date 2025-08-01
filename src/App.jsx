import "./styles.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Header from "./components/header/Header";
import SideMenu from "./components/sidemenu/SideMenu";
import Home from "./components/home/Home";
import StreamingPage from "./components/streaming/StreamingPage";
import { Routes, Route, Navigate } from 'react-router-dom';
import { faHouseUser, faTvAlt } from "@fortawesome/free-solid-svg-icons";


function App() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const navigate = useNavigate(); 

  const handleOptClick = (item) => {
    navigate(`/streams/${item}`, {state: { streamName: item }});

  };

  const menuItems = [
    {
      icon: faHouseUser,
      title: "Rancho",
      items: ["Rancho_1", "Rancho_2"],
      onClick: handleOptClick,
    },
    {
      icon: faTvAlt,
      title: "VOD",
      items: ["Tears of Steel", "Dragon", "Beep"],
      onClick: handleOptClick,
    },
  ];

  const toggleSidebar = () => {
    setMenuExpanded(!menuExpanded);
  };

  return (
    <Layout>
      <Header toggleSidebar={toggleSidebar} />
      <SideMenu
        menuItems={menuItems}
        setMenuExpanded={setMenuExpanded}
        menuExpanded={menuExpanded}
      />
      <Routes>
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="streams/:streamId" element={<StreamingPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
