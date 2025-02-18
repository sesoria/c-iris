import { useSelector } from "react-redux";
import { selectConfig } from "../../slices/configSlice";
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
// import { useLocation, Link } from 'react-router-dom';


function Header() {
  const { theme } = useSelector(selectConfig);
  // const { pathname } =  useLocation();


  return (
    <Navbar className="main-header" expand="lg" bg={theme} variant={theme}>
      <Container className="container-header">
        <Navbar.Brand>POC IRIS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Link className={pathname==="/dashboard" ? "nav-link active" : "nav-link"} to={"/map"}>Maps</Link>
            <Link className={pathname==="/dashboard" ? "nav-link active" : "nav-link"} to={"/dashboard"}>Dashboard</Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default Header;