import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Property = ({ property }) => {
  return (
    <Card className='my-3 rounded min-h-ap-card'>
      <Link to={`/property/${property._id}`}>
        <Card.Img src={property.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/property/${property._id}`}>
          <Card.Title as='div'>
            <strong>{property.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={property.rating}
            text={`${property.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>${property.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Property
