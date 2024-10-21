const APICounter = async (req, res, next) => {
    try {
        const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const today = new Date();
        const dateStr = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`;
        const monthStr = `${today.getMonth()}/${today.getFullYear()}`;

        if (req.metaCollection) {
            // Increment total API calls
            await req.metaCollection.updateOne(
                { id: 1 },
                { $inc: { "api.apiCalls": 1 } }
            );

            // Update IP address tracking
            await req.metaCollection.updateOne(
                { id: 1, "api.ipAdrs.ip": userIP },
                { $inc: { "api.ipAdrs.$.views": 1 } },
                { upsert: true }  // Creates a new entry if IP does not exist
            );

            // Update daily stats
            await req.metaCollection.updateOne(
                { id: 1, "api.stats.daily.date": dateStr },
                { $inc: { "api.stats.daily.$.views": 1 } },
                { upsert: true }
            );

            // Update monthly stats
            await req.metaCollection.updateOne(
                { id: 1, "api.stats.monthly.month": monthStr },
                { $inc: { "api.stats.monthly.$.views": 1 } },
                { upsert: true }
            );
        }

        next();
    } catch (error) {
        console.error("Error tracking API call:", error);
        next(error);
    }
};

module.exports = APICounter;
