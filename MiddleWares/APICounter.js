function getClientIP(req) {
    let xForwardedFor = req.headers['x-forwarded-for'];
    
    if (xForwardedFor) {
        let ipList = xForwardedFor.split(',');
        return ipList[0].trim(); 
    } else {
        return req.connection.remoteAddress;
    }
}

const APICounter = async (req, res, next) => {
    let userIPAddress = getClientIP(req)


    if (req.metaCollection) {
        await req.metaCollection.updateOne({ id: 1 }, { $inc: { apiCalls: 1 } });

        let data = await req.metaCollection.findOne({ id: 1 });
        data = data.api;

        // IP Address update
        let status = false;
        for (const [idx, obj] of data.ipAdrs.entries()) {
            if (obj.ip === userIPAddress) {
                data.ipAdrs[idx].views += 1;
                status = true;
                break; // Exit the loop once IP is found and updated
            }
        }
        if (!status) {
            let userIP = userIPAddress;
            data.ipAdrs.push({ ip: userIP, views: 1 });
        }

        // Day update
        let today = new Date().getDate() + "/" + new Date().getMonth() + '/' + new Date().getFullYear();
        status = false;
        for (const [idx, obj] of data.stats.daily.entries()) {
            if (obj.date === today) {
                data.stats.daily[idx].views += 1;
                status = true;
                break; // Exit the loop once the date is found and updated
            }
        }
        if (!status) {
            data.stats.daily.push({ date: today, views: 1 });
        }

        // Month update
        let month = new Date().getMonth() + '/' + new Date().getFullYear();
        status = false;
        for (const [idx, obj] of data.stats.monthly.entries()) {
            if (obj.month === month) {
                data.stats.monthly[idx].views += 1;
                status = true;
                break; // Exit the loop once the month is found and updated
            }
        }
        if (!status) {
            data.stats.monthly.push({ month: month, views: 1 });
        }

        await req.metaCollection.updateOne({ id: 1 }, { $set: { api: data } });
    }

    next()
}

module.exports = APICounter;
