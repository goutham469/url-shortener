const CheckUser = async(req,res,next) =>{

    if(req.body.api == false)
    {
        next()
    }

    
    let response = await req.usersCollection.find({email:req.body.email}).toArray()

    if(response[0])
    {
        if(response[0].credits > 0)
        {
            next();
        }
        else
        {
            res.send({status:false , message:"Your credits are over.Recharge to continue services."})
        }
    }
    else
    {
        res.send({status:false , message:"You are not an Authorized user. Create a a/c on our site ."})
    }
}

module.exports = CheckUser;