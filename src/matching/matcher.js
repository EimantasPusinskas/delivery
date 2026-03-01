import prisma from "../db.js";
import {haversine} from "./haversine.js";


async function findNearestDriver(restaurantLat, restaurantLng) {
    try {
        const drivers = await prisma.driver.findMany({
            where: {available: true},
        })
     
        if (drivers.length === 0) return null;

        let nearestDriver = drivers[0];
        let minDistance = haversine(restaurantLat, restaurantLng, drivers[0].lat, drivers[0].lng);

        for (let i = 1; i < drivers.length; i++) {
            const distance = haversine(restaurantLat, restaurantLng, drivers[i].lat, drivers[i].lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestDriver = drivers[i];
            }
        }
        
        return nearestDriver
    } catch (error) {
        console.error('Matching error: ',error )
        return null
    }
}

export {findNearestDriver}