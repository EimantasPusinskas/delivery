import prisma from "../db.js";
import {haversine} from "./haversine.js";
import { getLocation } from "../location/locationStore.js";


async function findNearestDriver(restaurantLat, restaurantLng) {
    try {
        const drivers = await prisma.driver.findMany({
            where: {available: true},
        })
     
        if (drivers.length === 0) return null;

        let nearestDriver = drivers[0];
        const firstFreshLocation = getLocation(drivers[0].id)
        const firstLat = firstFreshLocation ? firstFreshLocation.lat : drivers[0].lat
        const firstLng = firstFreshLocation ? firstFreshLocation.lng : drivers[0].lng

        let minDistance = haversine(restaurantLat, restaurantLng, firstLat, firstLng);

        for (let i = 1; i < drivers.length; i++) {
            const freshLocation = getLocation(drivers[i].id)
            const lat = freshLocation ? freshLocation.lat : drivers[i].lat
            const lng = freshLocation ? freshLocation.lng : drivers[i].lng

            const distance = haversine(restaurantLat, restaurantLng, lat, lng);
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