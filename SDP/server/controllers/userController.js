const User=require("../model/userModel")
const ActiveUsers=require("../model/statusModel");
const bcrypt=require('bcrypt')

module.exports.regCtrl = async (req,res,next) => {
    try{
        const {name,username,email,password,joinedOn} = req.body;
        const usernameCheck = await User.findOne({username})
        if(usernameCheck){
            return res.json({msg:"Username already exits 🤓",valid:false})
        }
        const emailCheck= await User.findOne({email});
        if(emailCheck){
            return res.json({msg:"Email already exits 🤓",valid:false})
        }

        const hashedPswd = await bcrypt.hash(password,10);

        const user= await User.create({
            name,
            email,
            username,
            password:hashedPswd,
            joinedOn
        });

        delete user.password;

        return res.json({user,valid:true})
     }catch(e){
        next(e);
    }
}

module.exports.logCtrl = async (req,res,next) => {
    try{
        const {username,password} = req.body;
        const userdet = await User.findOne({username})
        const isPswdValid =await bcrypt.compare(password,userdet.password)
        if(!userdet || !isPswdValid){
            return res.json({msg:"Incorrect Details ! 🤓",valid:false})
        }

        // const uStatus=await User.findOneAndUpdate({username},{
        //     isOnline:true
        // });

        // if(uStatus)
        // {
        //     console.log(uStatus.name+" is online : "+(uStatus.isOnline));
        // }
        
        delete userdet.password;
        

        return res.json({userdet,valid:true})
     }catch(e){
       // next(e);
      
        return res.json({e,valid:false})

    }
}

module.exports.getAllUsers=async (req,res,next) => {
    try{
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "name",
            "_id",
            "profilePic",
        ]);

        return res.json(users);

    }catch(err)
    {
        next(err);
    }
}

module.exports.profCtrl =  async (req,res,next) =>{
    try{
        const username=req.body.user;
        const profilePic=req.body.image;
       

        const userData=await User.findOneAndUpdate({username:username},{
           $set:{
              isProfileSet:true,
              profilePic:profilePic
           }
        });

        if(userData){
            return res.json({
                isSet:userData.isProfileSet,
                image:userData.profilePic
            });
        }
        else{
            return res.json({isSet:false,image:""});
        }

        
        

    }catch(ex)
    {
        next(ex);
    }
   
} 

module.exports.statusCtrl = async (req,res,next) => {
    try{
        const username=req.body.user;

       
        const uStatus= await ActiveUsers.create({
            username,lastSeen:""
        });

        const userss=await ActiveUsers.find();

        //console.log("active users : "+uStatus);

        return res.json(uStatus);
    }catch(ex)
    {
        next(ex);
    }
         
}

module.exports.logoutCtrl=async (req,res,next) =>{
    try{
          const usern=req.body.user;

          const date=new Date();
          const day= String(date.getDate()).padStart(2, '0');
          const lastSeen= date.toLocaleTimeString('en-US', { hour12: true })+day;

        //   const setSeen=await ActiveUsers.findOneAndUpdate(
        //     usern, 
        //     { 
        //         $set: {'lastSeen':lastSeen}
        //     },
        //   ( error, result)=>{
        //      if(result){
        //         console.log(result);
        //      }
        //      else {
        //         console.log(error);
        //      }
        // }).clone();

         

        
           
            const offuser=await ActiveUsers.findOneAndDelete({username:usern});
  
            return res.json(lastSeen);
        

          
  

    }catch(ex)
    {
        next(ex);
    }
}

module.exports.activeCtrl=async (req,res,next) =>{
    try{

        const userss=await ActiveUsers.find().select(["username"]);

        var array=[]
        for(i=0;i<userss.length;i++)
        {
            array[i]=userss[i].username;
        }

       return res.json(array);
    }catch(ex){
        next(ex)
    }
}

module.exports.searchFreinds=async (req,res,next)=>{
    try{

        const searchStr=req.body.str;

        const uid=req.body.uid;

        const onlydata=req.body.onlydata;

        if(onlydata === true){
            const chatusers = await User.find({username:uid}).select([
                "username",
                "name",
                "profilePic",
                "_id"
            ]);

            return res.json(chatusers);
        }


        const users = await User.find({_id:{$ne:uid}}).select([
            "email",
            "username",
            "name",
            "_id",
            "profilePic",
        ]);
 
        const frnds=[];

        for(var i=0; i<users.length;i++)
        {
            if (users[i].username.toLowerCase().indexOf(searchStr) !== -1) {
                frnds.push(users[i]);
            }
            else if(users[i].name.toLowerCase().indexOf(searchStr)!== -1) {
                frnds.push(users[i]);
            }
        }

        return res.json(frnds);


    }catch(ex){
       next(ex);
    }
}

module.exports.addFreinds=async (req,res,next)=>{
    try{
         const user=req.body.user;
         const me=req.body.me;

         const posst=req.body.post;

         if(posst)
         {
            
            const userData=await User.findOneAndUpdate({username:me[0]},{
                $addToSet:{
                    selectedChats:user
                }
            },{
                new: true
              });

           const userData2=await User.findOneAndUpdate({username:user[0]},{
                $addToSet:{
                    selectedChats:me
                }
            },{
                new: true
              });
            
  
           return res.json(userData+userData2);
         }
         else{
           const selChat = await User.find({username:me}).select(["selectedChats"]);

           return res.json(selChat);

         }

        



    }catch(ex){
        next(ex);
    }
}


module.exports.getUserData =async (req,res,next)=>{
    try{
          const uname=req.body.uname;

          const ress=await User.find({username:uname});

          return res.json(ress);

    }catch(ex){
        next(ex);
    }
}

module.exports.blockedUsers =async (req,res,next)=>{
    try{
        
        const {me,usern,post} = req.body;

        if(post){
            const userData=await User.findOneAndUpdate({username:me},{
                $addToSet:{
                    blockedUsers:`${me}-${usern}`
                }
                 },{
                new: true
              });

              const userData2=await User.findOneAndUpdate({username:usern},{
                $addToSet:{
                    blockedUsers:`${me}-${usern}`
                }
               },{
                new: true
              });

              return res.json({msg:`User ${usern} blocked Successfully`})

        }
        else{
            const blkusr = await User.find({username:me}).select(["blockedUsers"]);

            return res.json(blkusr);
        }

    }catch(ex){
        next(ex);
    }
}

module.exports.removeBlocked =async (req,res,next)=>{
    try{
          const {me,usern}= req.body;

          const respp=await User.findOneAndUpdate({username:me},{
               $pull :{blockedUsers:`${me}-${usern}`}
          });

          const respp2=await User.findOneAndUpdate({username:usern},{
            $pull :{blockedUsers:`${me}-${usern}`}
          });
            

          return res.json({msg:"Removed from block"});
         

    }catch(ex){
        next(ex);
    }
}