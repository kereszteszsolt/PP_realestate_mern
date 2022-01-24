import React from 'react'
import {Button, Modal} from 'react-bootstrap'

const MyModal = (props) => {
    return (
        <Modal show={props.showModal} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation needed</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.text}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.id ? props.handleAction(props.id) : props.handleAction}>
                    {props.actionText}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default MyModal