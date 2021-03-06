import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../actions/cartActions'


const PaymentScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    if (!shippingAddress) {
        history.push('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    return <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h4>Método de pagamento</h4>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as='legend'>Selecione método</Form.Label>
                <Col>
                    <Form.Check type="radio" label='PayPal' id="PayPal" name='paymentMethod' value='PayPal' checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                    {/* <Form.Check type="radio" label='Stripe' id="Stripe" name='paymentMethod' value='Stripe' checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check> */}
                </Col>
            </Form.Group>

            <Button type='submit' variant='success'>
                Continuar
            </Button>
        </Form>
    </FormContainer>
}

export default PaymentScreen