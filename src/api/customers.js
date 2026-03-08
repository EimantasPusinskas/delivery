import { Router } from 'express'
import prisma from '../db.js'
import { validateFields } from '../middleware/validate.js'

const router = Router()

router.post('/register', validateFields(['name', 'email']), async (req, res) => {
  const { name, email } = req.body

  try {
    const customer = await prisma.customer.create({
      data: { name, email }
    })
    res.status(201).json(customer)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already registered' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany()
    res.json(customers)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router