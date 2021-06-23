import React, { useState, useEffect } from 'react'

import { Form, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import Swal from 'sweetalert2'

import { getUserDetails, updateUser } from '../actions/userAction';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { USER_UPDATE_RESET } from '../constants/userConstants';


const UserEditScreen = ({ match, history }) => {

    const userId = match.params.id
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);


    const dispatch = useDispatch()
    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails
    const userUpdate = useSelector((state) => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userlist')
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    }, [dispatch, userId, user, successUpdate, history])


    const submitHandler = (e) => {
        e.preventDefault()
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Usuário Salvo',
            showConfirmButton: false,
            timer: 1500
        })
        dispatch(updateUser({ _id: userId, name, email, isAdmin }))
    }


    return (
        <>
            <Link to="/admin/userlist" className="btn btn-light my-3">
                Voltar
          </Link>
            <FormContainer>
                <h1>Editar</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant="danger" >{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                    <form onSubmit={submitHandler}>

                        <Form.Group controlId="name">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" placeholder="Nome" required value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="isAdmin">
                            <Form.Check type="checkbox" disabled={user.isAdmin === true} className="m-2" label="Administrador" value={isAdmin} checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                        </Form.Group>

                        <Button type="submit" className="btn-block m-3" variant="success" >
                            Salvar
                  </Button>
                    </form>
                )}
            </FormContainer>
        </>

    )
}

export default UserEditScreen
