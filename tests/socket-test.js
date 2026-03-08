import { io } from 'socket.io-client'

const driverId = 'cb5569a0-1b20-4aff-9bc4-0041ef82d82d'
const customerId = 'e3dd6cd0-848c-478e-8820-761ed34f4a78'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('Connected to server')
  socket.emit('register_driver', driverId)
  socket.emit('register_customer', customerId)
  console.log(`Registered as driver ${driverId} and customer ${customerId}`)
})

socket.on('order_assigned', (order) => {
  console.log('Driver notification - New order received:', order)
})

socket.on('order_update', (update) => {
    console.log('Customer notification - Order update:', update)
})

socket.on('disconnect', () => {
  console.log('Disconnected')
})
