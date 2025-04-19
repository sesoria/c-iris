import { Link } from 'react-router-dom';
import logo from "../../urjc-logo-3.png";
import { useSelector } from "react-redux";
import { selectConfig } from "../../slices/configSlice";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Container, Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Header({ toggleSidebar }) {
  const { theme } = useSelector(selectConfig);

  return (
    <Navbar className="main-header" expand="lg" bg={theme} variant={theme}>
      {/* Fluid para ancho completo + override del justify */}
      <Container fluid className="container-header d-flex justify-content-start align-items-center">
        <Button onClick={toggleSidebar} variant="outline-light" className="me-3">
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Link to="/home" className="d-flex align-items-center">
          <img src={logo} className="app-logo me-2" alt="logo" style={{ height: '30px', width: '50px', objectFit: 'contain', transform: 'translateY(-6  px)'}}/>
        </Link>
        <Navbar.Brand className="d-flex align-items-center">
            POC IRIS
        </Navbar.Brand>
      </Container>

    </Navbar>
  );
}

export default Header;
