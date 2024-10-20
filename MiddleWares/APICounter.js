const APICounter = async (req,res,next) =>{
    if(req.metaCollection)
    {
        await req.metaCollection.updateOne({id:1},{$inc:{apiCalls:1}})

        let data = await req.metaCollection.find({id:1}).toArray()
        data = data[0].api


        // ip Address update
        let status = false;
        data.ipAdrs.forEach(async (obj,idx) =>{
            if(obj.ip == req.ip)
            {
                data.ipAdrs[idx].views += 1;
                status = true;
                return;
            }
        })
        if(!status)
        {
            let userIP = req.ip
            data.ipAdrs.push({ip:userIP , views:1})
        }

        // day update
        let today = new Date().getDate() + "/" + new Date().getMonth() + '/' + new Date().getFullYear()
        status = false;
        data.stats.daily.forEach(async(obj , idx)=>{
            if(obj.date == today)
            {
                status = true;
                data.stats.daily[idx].views += 1;
                return
            }
        })
        if(!status)
        {
            data.stats.daily.push({date:today , views:1})
        }

        // month update
        let month = new Date().getMonth() + '/' + new Date().getFullYear()
        status = false;
        data.stats.monthly.forEach(async(obj , idx)=>{
            if(obj.month == month)
            {
                status = true;
                data.stats.monthly[idx].views += 1;
                return
            }
        })

        if(!status)
        {
            data.stats.monthly.push({month:month , views:1})
        }

        await req.metaCollection.updateOne({id:1} , {$set:{api:data}})
    }

    next()
}

module.exports = APICounter;