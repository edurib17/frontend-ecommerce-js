import React from 'react'
import { Link } from 'react-router-dom';

import { Card, Button } from 'react-bootstrap'
import Rating from './Rating';

const Product = ({ product, match, history }) => {
    return (
        <Card className='my-3 p-3 rounded'>
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant='top' style={{ height: 150 }} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as='div'><strong>{product.name}</strong></Card.Title>
                </Link>
                <Card.Text as='div'>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </Card.Text>
                <Card.Text as='h3'>{product.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Card.Text>
                <Link to={`/product/${product._id}`}>
                    <Button className='btn-block' variant="success" type='button' >
                        Adicionar <i className="fas fa-cart-plus"></i>
                    </Button>
                </Link>
            </Card.Body>
        </Card>
    )
}


export default Product
