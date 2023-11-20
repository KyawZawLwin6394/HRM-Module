const Setting = require("../models/setting");

async function verifySubscription (req,res,next){
    const setting = await Setting.find();
    console.log('setting is ',setting)
}

module.exports = verifySubscription;