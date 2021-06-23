import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap';


//Utils
import Swal from 'sweetalert2'

//Components
import { Button, Table, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';

//Actions
import { listUsers, deleteUser } from '../actions/userAction';

const UserListScreen = ({ history }) => {
    
    const dispatch = useDispatch();

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, successDelete,userInfo])

 

    //Delete user
    const deleteHandler = (id) => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Excluir usuário ??",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUser(id))
                Swal.fire(
                    'Usuário!',
                    'Usuário deletado',
                    'success'
                )
            }
        })
    }


    return (
        <>
            <h5>Usuários</h5>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table stripe bordered hover responsive className="table-sm  table-bordered table-striped table-responsive">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto: ${user.email}`}>{user.email}</a></td>
                                <td>
                                    {user.isAdmin ? (<i className="fas fa-check" style={{ color: 'green' }}></i>) : (
                                        <i className="fas fa-times" style={{ color: 'red' }} ></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant="warning" className='btn-sm'>
                                            <i className="fas fa-user-edit" style={{ color: 'white' }}></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" disabled={user.isAdmin === true} onClick={() => deleteHandler(user._id)}>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen
