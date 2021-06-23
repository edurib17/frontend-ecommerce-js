import React, { useState, useEffect } from 'react'


import { Link } from 'react-router-dom';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { useDispatch, useSelector } from 'react-redux'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import { PRODUCT_DETAILS_RESET } from '../constants/productConstants'

import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';

//Utils
import Swal from 'sweetalert2'


const ProductScreen = ({ history, match }) => {

    const [qty, setQty] = useState(1);
    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { success: successProductReview, loading: loadingProductReview, error: errorProductReview } = productReviewCreate

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    //Reviews
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');


    useEffect(() => {
        if (successProductReview) {
            setRating(0)
            setComment('')
        }
        if (!product._id || product._id !== match.params.id) {
            dispatch(listProductDetails(match.params.id))
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
    }, [dispatch, match, successProductReview])

    const addToCart = () => {
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Produto adicionado com sucesso!!',
            showConfirmButton: false,
            timer: 1500
        })
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(match.params.id, {
            rating,
            comment
        }))
    }

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                Voltar
            </Link>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} style={{ maxHeight: 450 }} fluid />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h6>{product.name}</h6>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Preço: R${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Descrição: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Preço:
                                                </Col>
                                            <Col>
                                                R$<strong>{product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {
                                                            [...Array(product.countInStock).keys()].map(x => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }

                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button onClick={addToCart} className='btn-block' variant="success" type='button' disabled={product.countInStock === 0}>
                                            {product.countInStock === 0 ? 'Fora De Estoque' : 'Adicionar'}
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>Não tem avaliações!!</Message>}
                            <ListGroup variant="flush">
                                {product.reviews.map(review => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <Card>
                                    <ListGroup.Item>
                                    {loadingProductReview && <Loader />}
                                        {successProductReview && (
                                            <Message variant='success'>
                                                Comentário adicionado com sucesso!!
                                            </Message>
                                        )}
                                        {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}
                                        {userInfo ? (

                                            <Form onSubmit={submitHandler}>
                                                <Form.Group controlId="rating">
                                                    <Form.Label>Avaliação</Form.Label>
                                                    <Form.Control
                                                        as='select'
                                                        value={rating}
                                                        onChange={(e) => setRating(e.target.value)}
                                                    >
                                                        <option value=''>Selecione...</option>
                                                        <option value='1'>1 - Horrível</option>
                                                        <option value='2'>2 - Péssimo</option>
                                                        <option value='3'>3 - Bom</option>
                                                        <option value='4'>4 - Muito Bom</option>
                                                        <option value='5'>5 - Excelente</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId="comment">
                                                    <Form.Label>Comentário</Form.Label>
                                                    <Form.Control
                                                        as='textarea'
                                                        row='3'
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    ></Form.Control>
                                                </Form.Group>
                                                <Button disabled={loadingProductReview} type='submit' style={{ margin: 10 }} variant='primary' >
                                                    Enviar
                                                </Button>
                                            </Form>
                                        ) : <Message >Logar <Link to="/login">Para realizar review no produto!!</Link></Message>}
                                    </ListGroup.Item>
                                </Card>

                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}

        </>
    )
}

export default ProductScreen
