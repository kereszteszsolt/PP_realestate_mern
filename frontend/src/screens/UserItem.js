import React, {useState} from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Button} from 'react-bootstrap'
import MyModal from '../components/MyModal'

const UserItem = (props) => {

    const [showModal,setShowModal] = useState(false)

    const handleDeleteClose = () => setShowModal(false)
    const handleDeleteShow = () => setShowModal(true)

    return (
        <tr key={props._id}>
            <td>{props._id}</td>
            <td>{props.name}</td>
            <td>
                <a href={`mailto:${props.email}`}>{props.email}</a>
            </td>
            <td>
                {props.isAdmin ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                )}
            </td>
            <td>
                <LinkContainer to={`/admin/user/${props._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                    </Button>
                </LinkContainer>
                <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={handleDeleteShow}
                >
                    <i className='fas fa-trash'></i>
                </Button>
                <MyModal text={`Do you really want to delete this user? : ${props.name} ${props._id}`}
                         showModal={showModal}
                         handleClose={handleDeleteClose}
                         actionText='Confirm Delete'
                         handleAction={() => props.onDelete(props._id)}
                />
            </td>
        </tr>
    )
}

export default UserItem