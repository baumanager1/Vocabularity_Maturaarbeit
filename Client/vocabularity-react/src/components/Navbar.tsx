import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap"
import "./Navbar.scss"


export default function MyNavbar() {
    const profilePicture :string = "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    return (
        <Navbar bg="primary" expand="lg">
            <Container>
                <Navbar.Brand id="navbar-brand" href="/">Vocabularity</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="navbar mx-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/study">Study</Nav.Link>
                        <Nav.Link href="/create">Create</Nav.Link>
                        <Nav.Link href="/japanese">日本語</Nav.Link>
                        <Nav.Link href="/profile"><img className="profilePicture" src={profilePicture} alt="Profile" /></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}