function validateFields(requiredFields) {
    return function(req, res, next) {
        for (let i=0; i<requiredFields.length; i++) {
            if (!req.body[requiredFields[i]]) {
                return res.status(400).json("All fields are required")
            }
        }

        next()
    }
}

export { validateFields }