import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {Row, Col, Image, ListGroup, Card, Button, Form, Table} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import {
    listPropertyDetails,
    createPropertyReview
} from '../actions/propertyAction'
import {PROPERTY_CREATE_REVIEW_RESET} from '../constants/propertyConstants'

const PropertyScreen = ({history, match}) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const propertyDetails = useSelector((state) => state.propertyDetails)
    const {loading, error, property} = propertyDetails

    const userLogin = useSelector((state) => state.userLogin)
    const {userInfo} = userLogin

    const propertyReviewCreate = useSelector((state) => state.propertyReviewCreate)
    const {
        success: successPropertyReview,
        loading: loadingPropertyReview,
        error: errorPropertyReview
    } = propertyReviewCreate

    useEffect(() => {
        if (successPropertyReview) {
            setRating(0)
            setComment('')
        }
        if (!property?._id || property._id !== match.params.id) {
            dispatch(listPropertyDetails(match.params.id))
            dispatch({type: PROPERTY_CREATE_REVIEW_RESET})
        }
    }, [dispatch, match, successPropertyReview, property._id])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(
            createPropertyReview(match.params.id, {
                rating,
                comment
            })
        )
    }

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                Go Back
            </Link>
            {loading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <Meta title={property.name}/>
                    <Row>
                        <Col md={6}>
                            <Image src={property.image} alt={property.name} fluid/>
                        </Col>
                        <Col md={6}>
                            <Table striped bordered hover variant='light'>
                                <thead>
                                <tr>
                                    <th colSpan='2'
                                        style={{fontWeight: 'bold', fontSize: 'large'}}> {property.name}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Price:</td>
                                    <td>${property.price}</td>
                                </tr>
                                <tr>
                                    <td>Nr of bedrooms:</td>
                                    <td>{property.nrOfBedrooms}</td>
                                </tr>
                                <tr>
                                    <td>Nr of bathrooms:</td>
                                    <td>{property.nrOfBathrooms}</td>
                                </tr>
                                <tr>
                                    <td>Address:</td>
                                    <td>{property.address}</td>
                                </tr>
                                <tr>
                                    <td>City:</td>
                                    <td>{property.city}</td>
                                </tr>
                                <tr>
                                    <td>District:</td>
                                    <td>{property.district}</td>
                                </tr>
                                <tr>
                                    <td colSpan='2'>Description:</td>
                                </tr>
                                <tr>
                                    <td colSpan='2'>{property.description}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {property.reviews.length === 0 && <Message>No Reviews</Message>}
                            <ListGroup variant='flush'>
                                {property.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating}/>
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Write a Customer Review</h2>
                                    {successPropertyReview && (
                                        <Message variant='success'>
                                            Review submitted successfully
                                        </Message>
                                    )}
                                    {loadingPropertyReview && <Loader/>}
                                    {errorPropertyReview && (
                                        <Message variant='danger'>{errorPropertyReview}</Message>
                                    )}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Button
                                                disabled={loadingPropertyReview}
                                                type='submit'
                                                variant='primary'
                                            >
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Message>
                                            Please <Link to='/login'>sign in</Link> to write a review{' '}
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default PropertyScreen
