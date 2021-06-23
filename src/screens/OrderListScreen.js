import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap';

//Components
import { Button, Table, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';

//Actions
import { listOrders } from '../actions/orderAction';

const OrderListScreen = ({ history }) => {

    const dispatch = useDispatch();

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, userInfo])

    return (
        <>
            <h5>Pedidos</h5>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table stripe bordered hover responsive className="table-sm  table-bordered table-striped table-responsive">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Pagamento</th>
                            <th>Enviado</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>
                                    {order.createdAt.substring(0, 10)}
                                </td>
                                <td>
                                    {order.totalPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td>
                                    {order.isPaid ? (order.paidAt.substring(0, 10)) : (
                                        <i className="fas fa-times" style={{ color: 'red' }} ></i>
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered ? (order.deliverAt.substring(0, 10)) : (
                                        <i className="fas fa-times" style={{ color: 'red' }} ></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant="warning" className='btn-sm'>
                                            Detalhes
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default OrderListScreen
