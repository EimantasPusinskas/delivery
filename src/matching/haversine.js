function haversine(lat1, lon1, lat2, lon2) {
    const lat1Rad = convertDegreesToRadians(lat1);
    const lon1Rad = convertDegreesToRadians(lon1);
    const lat2Rad = convertDegreesToRadians(lat2);
    const lon2Rad = convertDegreesToRadians(lon2)

    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = lon2Rad - lon1Rad;

    const R = 6371; // approx radius of Earth

    const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin(deltaLon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;

    return d;
}

function convertDegreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export {haversine}
