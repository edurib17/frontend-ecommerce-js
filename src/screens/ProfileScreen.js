import React, { useState, useEffect } from 'react'

//Components
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import Message from '../components/Message';
import Loader from '../components/Loader';

//Utils redux & userAction & orderAction 
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../actions/userAction';
import { listMyOrders } from '../actions/orderAction';


//Consts
const ProfileScreen = ({ location, history }) => {

    //States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);


    const dispatch = useDispatch()

    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
    const { success } = userUpdateProfile


    const orderListMy = useSelector((state) => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy




    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, history, userInfo, user])


    //Function login
    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('As senhas não são iguais!!!')
        } else {
            dispatch(updateUserProfile({ id: user._id, name, email, password }))
        }
    }


    return <Row>
        <Col md={3}>
            <h4>Perfil</h4>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {success && <Message variant='success'>Perfil Atualizado</Message>}
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
                    <Form.Control type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirmar Senha</Form.Label>
                    <Form.Control type="password" placeholder="Confirme Sua Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Button type="submit" className="btn-block m-3" variant="success" >
                    Atualizar
                </Button>
            </form>
        </Col>
        <Col md={9}>
            <h5>Minhas Compras</h5>
            {loadingOrders ? <Loader /> : errorOrders ? <Message variant="danger">{errorOrders}</Message> : (
                <Table striped bordered hover responsive className="table-sm  table-bordered table-striped table-responsive">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Pago</th>
                            <th>Enviado</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {orders.map(order =>(
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>{order.totalPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0,10): (
                                        <i className="fas fa-times-circle" style={{color: 'red'}}></i>
                                    )}</td>
                                      <td>{order.isDelivered ? order.deliverAt.substring(0,10): (
                                        <i className="fas fa-times-circle" style={{color: 'red'}}></i>
                                    )}</td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className="btn-sm" variant="light">Detalhes</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </Table>
            )}
        </Col>
    </Row>
}

export default ProfileScreen
