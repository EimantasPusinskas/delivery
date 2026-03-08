import prisma from "../db.js"

const locationStore = {}

function updateLocation(driverId, lat, lng) {
    locationStore[driverId] = { lat, lng, updatedAt: Date.now() }
}

function getLocation(driverId) {
    return locationStore[driverId] || null
}

function getAllLocations() {
    return locationStore
}

async function flush() {
    try {
        for (const [driverId, location] of Object.entries(locationStore)) {
            await prisma.driver.update({
                where: {id: driverId}, 
                data: {lat: location.lat, lng: location.lng
                }
            })
        } 
        console.log(`Flushed ${Object.keys(locationStore).length} driver locations to database`)
    } catch (error) {
        console.error('Flush error:', error)
    }
}

setInterval(flush, 30000)

export { updateLocation, getLocation, getAllLocations }