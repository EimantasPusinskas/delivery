import { Router } from 'express'
import prisma from '../db.js'
import { findNearestDriver } from '../matching/matcher.js'
import { io } from '../index.js'
import { validateFields } from '../middleware/validate.js'
import { isValidTransition } from '../utils/transitions.js'

const router = Router()

router.get("/", async(req, res) => {
    try {
        const orders = await prisma.order.findMany()
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.post('/place', validateFields(['customerId', 'restaurantId', 'items', 'price']), async(req, res) => {
    const { customerId, restaurantId, items, price } = req.body;

    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: {id: restaurantId},
        });
        if (!restaurant) {
            return res.status(404).json({error: 'Restaurant not found'})
        }

        const driver = await findNearestDriver(restaurant.lat, restaurant.lng);
        if (!driver) {
            return res.status(404).json({error: 'No drivers available'})
        }

        const order = await prisma.order.create({
            data: {items, price, restaurantId, customerId, driverId: driver.id}
        })
        
        await prisma.driver.update({
            where: {id: driver.id}, 
            data: {available: false},
        });

        io.to(driver.id).emit('order_assigned', {
            orderId: order.id, 
            items: order.items, 
            price: order.price, 
            restaurantId: order.restaurantId
        })

        res.status(201).json(order)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'})
    }   
})

router.patch('/:id/status', async(req, res) => {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['CLAIMED', 'PICKED_UP', 'DELIVERED', 'DISPUTED']

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' })
    }

    try {
        const existingOrder = await prisma.order.findUnique({
            where: { id }
        })

        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' })
        }

        if (!isValidTransition(existingOrder.status, status)) {
            return res.status(400).json({ 
                error: `Cannot transition from ${existingOrder.status} to ${status}` 
            })
        }

        const order = await prisma.order.update({
            where:  { id }, 
            data:   { status },
        })

        io.to(order.customerId).emit('order_update', {
            orderId: order.id, 
            status: order.status
        })
        res.status(200).json(order)
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router