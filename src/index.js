import express from 'express'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import restaurantRoutes from './api/restaurants.js'
import drivers from './api/drivers.js'
import customers from './api/customers.js'
import orderRoutes from './api/orders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/restaurants', restaurantRoutes)
app.use('/drivers', drivers)
app.use("/customers", customers)
app.use('/orders', orderRoutes)

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('register_driver', (driverId) => {
    socket.join(driverId)
    console.log(`Driver ${driverId} registered on socket ${socket.id}`)
  })

  socket.on('register_customer', (customerId) => {
    socket.join(customerId)
    console.log(`Customer ${customerId} registered`)
})

  socket.on('disconnect', () =>{
    console.log(`Client disconnected: ${socket.id}`)
  })
})

export {io}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app