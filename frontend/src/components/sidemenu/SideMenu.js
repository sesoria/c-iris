import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, InputGroup, Button } from "react-bootstrap";
import { faChevronDown, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "react-bootstrap-sidebar-menu";
import logo from "../../urjc-logo-2.png";
import { useSelector } from "react-redux";
import { selectConfig } from "../../slices/configSlice";


function SideMenu({ menuItems }) {
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState(null);
  const { theme } = useSelector(selectConfig);

  const handleToggle = () => {
    if (menuExpanded) setSubMenuOpen(null);
    setMenuExpanded(!menuExpanded);
  };

  function SidebarNavItem({ icon, title, items, onClick, searchBar = false, onChangeInput }) {
    const inputValue = localStorage.getItem(`prefix${title}`) || '';
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) inputRef.current.focus();
    }, [items]);

    const handleSubToggle = () => {
      if (!menuExpanded) {
        setMenuExpanded(true);
        setTimeout(() => setSubMenuOpen(title), 250);
      } else {
        setSubMenuOpen(subMenuOpen === title ? null : title);
      }
    };

    const handleClick = (item) => () => {
      onClick(item);
    };

    const handleChange = (event) => {
      const prefix = event.target.value;
      localStorage.setItem(`prefix${title}`, prefix);
      onChangeInput(prefix);
    };

    return (
      <Sidebar.Sub className="mb-3" onToggle={handleSubToggle} expanded={subMenuOpen === title}>
        <Sidebar.Sub.Toggle>
          <FontAwesomeIcon icon={icon} />
          <Sidebar.Nav.Title className="nav-title">{title}
            <Sidebar.Nav.Icon className="float-end font-xs">
              <FontAwesomeIcon icon={faChevronDown} />
            </Sidebar.Nav.Icon>
          </Sidebar.Nav.Title>
        </Sidebar.Sub.Toggle>
        <Sidebar.Sub.Collapse>
          <Sidebar.Nav>
            {searchBar &&
              <InputGroup className="mb-1">
                <InputGroup.Text className="ps-3">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputGroup.Text>
                <Form.Control
                  className="input"
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  ref={inputRef}
                />
              </InputGroup>
            }
            {items.map((item, index) => (
              <Button onClick={handleClick(item)} key={index} variant="secondary" className="mb-1 option-menu">
                {item}
              </Button>
            ))}
          </Sidebar.Nav>
        </Sidebar.Sub.Collapse>
      </Sidebar.Sub>
    )
  };

  return (
    <Sidebar className="sidebar" variant={theme} bg={theme} expand={false} onToggle={handleToggle} expanded={menuExpanded}>
      <Sidebar.Collapse getScrollValue={260}>
        <Sidebar.Header>
          <Sidebar.Brand className="sidebar-header">
            <Link to="/home"> {/* Reemplaza "/home" con la ruta a la que desees redirigir */}
              <img src={logo} className="app-logo" alt="logo" />
            </Link>
          </Sidebar.Brand>
          <Sidebar.Toggle />
        </Sidebar.Header>
        <Sidebar.Body className="font-m">
          <Sidebar.Nav>
            {menuItems.map((item, index) => (
              <SidebarNavItem
                key={index}
                icon={item.icon}
                title={item.title}
                items={item.items}
                onClick={item.onClick}
                searchBar={item.searchBar}
                onChangeInput={item.onChangeInput}
              />
            ))}
          </Sidebar.Nav>
        </Sidebar.Body>
      </Sidebar.Collapse>
    </Sidebar>
  );
};


export default SideMenu;