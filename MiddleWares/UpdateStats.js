const UpdateStats = async(path , req , DBdata) =>{
    await req.urlsCollection.updateOne({key:path} , {$inc:{views:1}})

    let status = false;

    DBdata.ipAdrs.forEach(async (obj,idx) =>{
        if(obj.ip == req.ip)
        {
            DBdata.ipAdrs[idx].views += 1;
            status = true;
            await req.urlsCollection.updateOne({key:path} , {$set:{ipAdrs : DBdata.ipAdrs}})
            return;
        }
    })
    if(!status)
    {
        let userIP = req.ip
        await req.urlsCollection.updateOne({key:path} , {$push:{ipAdrs : {ip:userIP , views:1}}})
    }


    // day update
    let today = new Date().getDate() + "/" + new Date().getMonth() + '/' + new Date().getFullYear()
    status = false;
    DBdata.stats.daily.forEach(async(obj , idx)=>{
        if(obj.date == today)
        {
            status = true;
            DBdata.stats.daily[idx].views += 1;
            return
        }
    })
    if(!status)
    {
        DBdata.stats.daily.push({date:today , views:1})
    }

    // month update
    let month = new Date().getMonth() + '/' + new Date().getFullYear()
    status = false;
    DBdata.stats.monthly.forEach(async(obj , idx)=>{
        if(obj.month == month)
        {
            status = true;
            DBdata.stats.monthly[idx].views += 1;
            return
        }
    })

    if(!status)
    {
        DBdata.stats.monthly.push({month:month , views:1})
    }

    // final DataBase update
    await req.urlsCollection.updateOne({key:path} , {$set:{stats : DBdata.stats}})
}

module.exports = UpdateStats;