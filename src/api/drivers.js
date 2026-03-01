import { Router } from 'express'
import prisma from '../db.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { name, email, lat, lng } = req.body

  if (!name || !email || !lat || !lng) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const driver = await prisma.driver.create({
      data: { name, email, lat, lng }
    })
    res.status(201).json(driver)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already registered' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany()
    res.json(drivers)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router