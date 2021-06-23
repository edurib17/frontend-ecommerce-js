import React, { useState, useEffect } from 'react'
import axios from 'axios';

//Components
import { PayPalButton } from 'react-paypal-button-v2';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Swal from 'sweetalert2'

//Utils
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

//Actions&Constants
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderAction';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';


const OrderScreen = ({ match, history }) => {
    const orderId = match.params.id
    const [sdkReady, setSdkReady] = useState(false);
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    if (!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }
        //Calcular Valores
        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    }

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }

        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if (!order || successPay || successDeliver || order._id !== orderId) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, orderId, successPay, order, successDeliver])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Enviar Produto Para Entrega ??",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deliverOrder(order))
                Swal.fire(
                    'Produto!',
                    'Produto enviado',
                    'success'
                )
            }
        })
    }

    return loading ? <Loader /> : error ? <Message variant="danger">{error}</Message>
        : <>
           {/* <h5>ID compra {order._id}</h5>*/}


            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <Card>
                            <ListGroup.Item>
                                <h5>Endereço</h5>
                                <p> <strong>Nome: </strong> {order.user.name}</p>
                                <p> <strong>Email: </strong> {' '}
                                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                </p>
                                <p>
                                    <strong>Endereço: </strong> {order.shippingAddress.address} <strong>Cidade: </strong> {order.shippingAddress.city} <strong>CEP:</strong> {order.shippingAddress.postalCode} <strong>País:</strong>  {order.shippingAddress.country}
                                    {order.isDelivered ? <Message variant="success">Pedido {order.isDelivered} enviado com sucesso!!</Message> : <Message variant="danger">Não foi enviado ainda!!</Message>}
                                </p>
                            </ListGroup.Item>
                        </Card>


                        <Card>
                            <ListGroup.Item>
                                <h5>Método de Pagamento</h5>
                                <p>
                                    <strong>Método Selecionado: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? <Message variant="success">Pedido {order.paidAt} pago com sucesso!!</Message> : <Message variant="warning">Pagamento não foi aprovado!!</Message>}
                            </ListGroup.Item>
                        </Card>


                        <Card>
                            <ListGroup.Item>
                                <h5>Cart: </h5>
                                {order.orderItems.length === 0 ? <Message>Você não tem pedidos 😪!!</Message> : (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}         {console.log(item.name)}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x {item.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} = R${item.qty * item.price}
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
                                <h5>Resumo</h5>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Itens</Col>
                                    <Col>R${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Frete</Col>
                                    <Col>R${order.shippingPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>R${order.totalPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <PayPalButton amount={order.totalPrice.toFixed(2)} onSuccess={successPaymentHandler} />
                                    )}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type="button" className="btn- btn-block" onClick={deliverHandler}>Entregar</Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
}

export default OrderScreen
