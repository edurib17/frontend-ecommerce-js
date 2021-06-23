import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../actions/cartActions'


const ShippingScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);


    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        history.push('/payment')
    }

    return <FormContainer>
        <CheckoutSteps  step1 step2/>
        <h4>Endereço</h4>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="adress">
                <Form.Label>Endereço</Form.Label>
                <Form.Control type="text" placeholder="Endereço" required value={address} onChange={(e) => setAddress(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="city">
                <Form.Label>Cidade</Form.Label>
                <Form.Control type="text" placeholder="Cidade" required value={city} onChange={(e) => setCity(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="postalCode">
                <Form.Label>CEP</Form.Label>
                <Form.Control type="text" placeholder="CEP" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="country">
                <Form.Label>País</Form.Label>
                <Form.Control type="text" placeholder="País" required value={country} onChange={(e) => setCountry(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type='submit' className="m-3" variant='success'>
                Continuar
            </Button>
        </Form>
    </FormContainer>
}

export default ShippingScreen