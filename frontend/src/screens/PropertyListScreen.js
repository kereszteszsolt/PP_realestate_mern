import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  listProperty,
  deleteProperty,
  createProperty,
} from '../actions/propertyAction'
import { PROPERTY_CREATE_RESET } from '../constants/propertyConstants'

const PropertyListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const propertyList = useSelector((state) => state.propertyList)
  const { loading, error, properties, page, pages } = propertyList

  const propertyDelete = useSelector((state) => state.propertyDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = propertyDelete

  const propertyCreate = useSelector((state) => state.propertyCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    property: createdProperty,
  } = propertyCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: PROPERTY_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    if (successCreate) {
      console.log(successCreate)
      history.push(`/admin/property/${createdProperty._id}/edit`)
    } else {
      dispatch(listProperty('', pageNumber))
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProperty,
    pageNumber,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProperty(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProperty())
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Properties</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Property (new ad)
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>TRANSACTION TYPE</th>
                <th>PROPERTY TYPE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td>{property._id}</td>
                  <td>{property.name}</td>
                  <td>${property.price}</td>
                  <td>{property.transactionType}</td>
                  <td>{property.propertyType}</td>
                  <td>
                    <LinkContainer to={`/admin/property/${property._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(property._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default PropertyListScreen
