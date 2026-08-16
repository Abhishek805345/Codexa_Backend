const { ObjectId } = require('mongodb');
const {getdb}=require('./serverconnection');


class outerclass{
  static registerdata(data){
   const _db=getdb();
   return _db.collection('userdata').insertOne(data); 
  }
  //login data fetch
  static findbyemail(email){
    const _db=getdb();
    return _db.collection('userdata').find({email:email}).next();
  }
  //save the password
  static savepassword(email,data){
    const _db=getdb();
    return _db.collection('userdata').updateOne({email:email},{$set:data});
  }
  //find with usesrname
  static findbyusername(rusername){
    const _db=getdb();
    return _db.collection('userdata').find({rusername:rusername}).next();
  }
  //findbyid fxn
  static findbyid(id){
    const _db=getdb();
    return _db.collection('userdata').find({_id:new ObjectId(id)}).next();
  }
    //save room id to user data
  static updateuserroom(data){
    const _db=getdb();
    return _db.collection('userdata').updateOne({_id:new ObjectId(data._id)},{$set:{room:data.room,mycurrentroom:data.mycurrentroom}});
  }  
  //delete user  
  static deleteuser(userid){
    const _db=getdb();
    return _db.collection('userdata').deleteOne({_id:new ObjectId(userid)});
  }
  //updating user data
  static updateuser(userid,data){
    const _db=getdb();
    return _db.collection('userdata').updateOne({_id:new ObjectId(userid)},{$set:data});
  }
}

exports.outerclass=outerclass;