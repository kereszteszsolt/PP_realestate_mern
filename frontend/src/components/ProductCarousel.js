import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopProperties } from '../actions/propertyAction'

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const propertyTopRated = useSelector((state) => state.propertyTopRated)
  const { loading, error, properties } = propertyTopRated

  useEffect(() => {
    dispatch(listTopProperties())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-dark'>
      {properties.map((property) => (
        <Carousel.Item key={property._id}>
          <Link to={`/property/${property._id}`}>
            <Image src={property.image} alt={property.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2>
                {property.name}
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
