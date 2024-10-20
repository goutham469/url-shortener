const DBAccess = (req,res,next) =>{
    req.urlsCollection = req.app.get('urlsCollection')
    req.metaCollection = req.app.get('metaCollection')
    req.usersCollection = req.app.get("usersCollection")

    next()
}

module.exports = DBAccess;