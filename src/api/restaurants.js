import { Router } from 'express'
import prisma from '../db.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { name, email, address, lat, lng } = req.body

  if (!name || !email || !address || !lat || !lng) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const restaurant = await prisma.restaurant.create({
      data: { name, email, address, lat, lng }
    })
    res.status(201).json(restaurant)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already registered' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany()
    res.json(restaurants)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router