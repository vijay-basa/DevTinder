const adminAuth = (req, res, next) => {
    console.log("Admin Auth check")
    const token = "xyz";
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized) {
        res.status(401).send("Unauthorized request")
    } else {
        next()
    }
}

const userAuth = (req, res, next) => {
    console.log("User Auth check")
    const token = "xyz";
    const isUserAuthorized = token === "xyz"
    if(!isUserAuthorized) {
        res.status(401).send("Unauthorized request")
    } else {
        next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}