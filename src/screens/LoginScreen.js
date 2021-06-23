import React, { useState, useEffect } from 'react'

//Routes
import { Link } from 'react-router-dom';

//Components
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

//Redux
import { useDispatch, useSelector } from 'react-redux';

//Actions
import { login } from '../actions/userAction';



const LoginScreen = ({ location, history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const redirect = location.search ? location.search.split('=')[1] : '/'
    const dispatch = useDispatch()
    const useLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo } = useLogin

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])


    return (
        <FormContainer>
            <h1>Login</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <form onSubmit={submitHandler}>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Button type="submit" className="btn-block m-3" variant="success" >
                    Entrar
                </Button>

            </form>
            <Row className="py-3">
                <Col>
                    Você ainda não tem uma conta?{' '}<Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Crie uma nova conta aqui!!</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
