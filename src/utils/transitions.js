const validTransitions = {
    PLACED: ['CLAIMED', 'DISPUTED'],
    CLAIMED: ['PICKED_UP', 'DISPUTED'],
    PICKED_UP: ['DELIVERED', 'DISPUTED'],
    DELIVERED: [],
    DISPUTED: []
}

function isValidTransition(currentStatus, newStatus) {
    return validTransitions[currentStatus]?.includes(newStatus)
}

export { isValidTransition }