import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { createdOrder } from '../actions/orderAction';

import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'


const PlaceOrderScreen = ({ history }) => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart)
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }
    //Calcular Valores
    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    cart.shippingPrice = addDecimals(cart.itemsPrice >= 100 ? 0 : 25.00)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice))

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`)
            dispatch({ type: USER_DETAILS_RESET })
            dispatch({ type: ORDER_CREATE_RESET })
        }
        // eslint-disable-next-line
    }, [history, success])

    const placeOrderHandler = () => {
        dispatch(createdOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice
        }))
    }

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>

                        <Card>
                            <ListGroup.Item>
                                <h5>Endereço</h5>
                                <p>
                                    <strong>Endereço: </strong> {cart.shippingAddress.address} <strong>Cidade: </strong> {cart.shippingAddress.city} <strong>CEP:</strong> {cart.shippingAddress.postalCode} <strong>País:</strong>  {cart.shippingAddress.country}
                                </p>
                            </ListGroup.Item>
                        </Card>
                        <Card>
                            <ListGroup.Item>
                                <h5>Método de Pagamento</h5>
                                <strong>Método Selecionado: </strong>
                                {cart.paymentMethod}
                            </ListGroup.Item>
                        </Card>
                        <Card>
                           <ListGroup.Item>
                            <h5>Pedidos: </h5>
                            {cart.cartItems.length === 0 ? <Message>Seu carrinho está vazio 😪!!</Message> : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x R${item.price} = R${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}

                                </ListGroup>
                            )}
                        </ListGroup.Item>
                        </Card>
                

                    </ListGroup>
                </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h5>Resumos</h5>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Itens</Col>
                                        <Col>R${cart.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Frete</Col>
                                        <Col>R${cart.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>R${cart.totalPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup>
                                    {error && <Message variant="danger">{error}</Message>}
                                </ListGroup>
                                <ListGroup.Item>
                                    <Button type="button" variant="success" className="btn-block" disabled={cart.cartItems === 0} onClick={placeOrderHandler}>Confirmar</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
            </Row>

        </>
    )
}

export default PlaceOrderScreen
