const FeedB=require("../model/feedbackModel")

module.exports.sendFbCtrl = async (req,res,next) => {
    try{
        const {username,toUser,description,date}=req.body;

        const sadsd=await FeedB.create({
            username:username,
            toUser:toUser,
            description:description,
            date:date
        });

        if(sadsd)
        {
            return res.json({msg:"Your feedback has been sent successfully ! Admin will react soon"})
        }
        else{
            return res.json({msg:"Error Can't send feedback "})
        }
    }catch(ex){
        next(ex)
    }
}

module.exports.getFbCtrl = async (req,res,next) => {
    try{
        const {username,toUser}=req.body;

        const sadsd=await FeedB.find({username:username});

        if(sadsd)
        {
            return res.json(sadsd)
        }
        else{
            return res.json({msg:"Error Can't get feedback "})
        }
    }catch(ex){
        next(ex)
    }
}