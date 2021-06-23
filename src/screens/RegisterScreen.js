import React, { useState, useEffect } from 'react'


import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { register } from '../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const RegisterScreen = ({ location, history }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState(null);
    const redirect = location.search ? location.search.split('=')[1] : '/'
    const dispatch = useDispatch()
    const userRegister = useSelector((state) => state.userRegister)
    const { loading, error, userInfo } = userRegister



    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('As senhas não são iguais!!!')
        } else {
            dispatch(register(name, email, password))
        }

    }

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])


    return (
        <FormContainer>
            <h1>Registro</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <form onSubmit={submitHandler}>

                <Form.Group controlId="name">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" placeholder="Nome" required value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirmar Senha</Form.Label>
                    <Form.Control type="password" placeholder="Confirme Sua Senha" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Button type="submit" className="btn-block m-3" variant="success" >
                    Registrar
                </Button>

            </form>
            <Row className="py-3">
                <Col>
                    Você já tem uma conta?{' '}<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Acessar sua conta!!</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen
