import { Router } from 'express'
import prisma from '../db.js'
import { findNearestDriver } from '../matching/matcher.js'

const router = Router()

router.post('/place', async(req, res) => {
    const { customerId, restaurantId, items, price } = req.body;

    if (!customerId || !restaurantId || !items || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

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

        res.status(201).json(order)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'})
    }   
    
})

router.get("/", async(req, res) => {
    try {
        const orders = await prisma.order.findMany()
        res.json(orders)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router