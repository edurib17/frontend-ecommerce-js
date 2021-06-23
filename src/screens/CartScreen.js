import React, { useEffect } from 'react'

import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';

import { addToCart, removeFromCart } from '../actions/cartActions';

//Utils
import Swal from 'sweetalert2'

const CartScreen = ({ match, location, history }) => {

    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])


    //Delete product cart
    const removeFromCartHandler = (id) => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Excluir produto do carrinho ??",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeFromCart(id))
                Swal.fire(
                    'Produto!',
                    'Produto deletado',
                    'success'
                )
            }
        })
    }

    const checkoutHandler = () => {
        history.push('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Seu carrinho</h1>
                {cartItems.length === 0 ? <Message>Seu Carrinho está vazio 😰!!<Link to="/"> Volte para as compras!!</Link></Message> : (
                    <ListGroup variant="flush">
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md="2">
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>{item.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Col>
                                    <Col md={2}>
                                        <Form.Control as='select' value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                            {[...Array(item.countInStock).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.product)}>
                                            <i className="fas fa-trash"></i>
                                        </Button>

                                    </Col>
                                </Row>

                            </ListGroup.Item>
                        ))}
                    </ListGroup>)}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h5>
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                            </h5>
                            {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button type='button' variant="success" className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>{cartItems.length === 0 ? 'Carrinho Vazio' : 'Checkout' }</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen