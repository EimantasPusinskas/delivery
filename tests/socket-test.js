import { io } from 'socket.io-client'

const driverId = 'cb5569a0-1b20-4aff-9bc4-0041ef82d82d'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('Connected to server')
  socket.emit('register_driver', driverId)
  console.log(`Registered as driver ${driverId}`)
})

socket.on('order_assigned', (order) => {
  console.log('New order received:', order)
})

socket.on('disconnect', () => {
  console.log('Disconnected')
})