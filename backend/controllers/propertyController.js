import asyncHandler from 'express-async-handler'
import Property from '../models/propertyModel.js'

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Property.countDocuments({ ...keyword })
  const properties = await Property.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ properties, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)

  if (property) {
    res.json(property)
  } else {
    res.status(404)
    throw new Error('Property not found')
  }
})

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)

  if (property) {
    await property.remove()
    res.json({ message: 'Property removed' })
  } else {
    res.status(404)
    throw new Error('Property not found')
  }
})

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = asyncHandler(async (req, res) => {
  const property = new Property({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    propertyType: 'Sample type',
    transactionType: 'Sample category',
    numReviews: 0,
    description: 'Sample description',
    numOfBedrooms: 0,
    numOfBathrooms: 0,
    address: 'Sample Address',
    city: 'Sample city',
    district: 'Sample district'
  })

  const createdProduct = await property.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    propertyType,
    transactionType,
    nrOfBedRooms,
    nrOfBathrooms,
    city,
    district,
    address

  } = req.body

  const property = await Property.findById(req.params.id)

  if (property) {
    property.name = name
    property.price = price
    property.description = description
    property.image = image
    property.propertyType = propertyType
    property.transactionType = transactionType
    property.nrOfBedRooms = nrOfBedRooms
    property.nrOfBathrooms = nrOfBathrooms
    property.city = city
    property.district = district
    property.address = address

    const updatedProduct = await property.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Property not found')
  }
})

// @desc    Create new review
// @route   POST /api/properties/:id/reviews
// @access  Private
const createPropertyReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const property = await Property.findById(req.params.id)

  if (property) {
    const alreadyReviewed = property.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Property already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    property.reviews.push(review)

    property.numReviews = property.reviews.length

    property.rating =
      property.reviews.reduce((acc, item) => item.rating + acc, 0) /
      property.reviews.length

    await property.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Property not found')
  }
})

// @desc    Get top rated properties
// @route   GET /api/properties/top
// @access  Public
const getTopProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({}).sort({ rating: -1 }).limit(3)

  res.json(properties)
})

export {
  getProperties,
  getPropertyById,
  deleteProperty,
  createProperty,
  updateProperty,
  createPropertyReview,
  getTopProperties,
}
