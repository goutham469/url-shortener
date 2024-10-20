const exp = require('express')
const URLsAPI = exp.Router()

URLsAPI.get('/' ,(req,res)=>{
    res.send("URLS API")
})


module.exports = URLsAPI;