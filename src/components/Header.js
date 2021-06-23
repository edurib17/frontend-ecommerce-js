import React from 'react';

//Action
import { logout } from '../actions/userAction';

//Routes
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap';

//Components
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';


const Header = () => {
    //Consts
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    // logout 
    const logoutHandler = () => {
        dispatch(logout())
    }

    //Icon for users
    const navDropdownTitle = (<i className="fas fa-user"></i>);
    const navDropdownAdm = (<i className="fas fa-user-shield"></i>);



    return <header>
        <Navbar bg="success" variant='dark' collapseOnSelect>
            <Container className="p-2 just"  >
                <LinkContainer to="/">
                    <Navbar.Brand>Amâncio Js</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav"  />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <LinkContainer to="/cart" style={{marginLeft:800}} >
                            <Nav.Link><i className="fas fa-shopping-cart"></i>Carrinho</Nav.Link>
                        </LinkContainer>
                        {userInfo ?  (
                            <NavDropdown disabled={userInfo.isAdmin === true} title={navDropdownTitle} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>Perfil</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>Sair</NavDropdown.Item>
                            </NavDropdown>
                        )
                            : (<LinkContainer to="/login">
                                <Nav.Link><i className="fas fa-user"></i> Entrar</Nav.Link>
                            </LinkContainer>
                            )}
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title={navDropdownAdm} id='adminmenu'>
                                <LinkContainer to='/admin/userlist'>
                                    <NavDropdown.Item>Usuários</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/productlist'>
                                    <NavDropdown.Item>Produtos</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/orderlist'>
                                    <NavDropdown.Item>Pedidos</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>Sair</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    </header >
}

export default Header
