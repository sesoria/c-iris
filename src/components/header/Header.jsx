import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectConfig } from "../../slices/configSlice";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Container, Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Header({ toggleSidebar }) {
  const { theme } = useSelector(selectConfig);

  return (
    <Navbar className="main-header p0" expand="lg" bg={theme} variant={theme}>
      <Container fluid className="container-header d-flex align-items-center">
        <Button onClick={toggleSidebar} variant="outline-light" className="me-3">
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Link to="/home" className="d-flex align-items-center mx-auto" style={{cursor: "pointer"}}>
          <img src="/urjc-logo.png" className="app-logo" alt="Logo URJC" />
        </Link>
      </Container>
    </Navbar>
  );
}

export default Header;
