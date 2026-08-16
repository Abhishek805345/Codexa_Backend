const { ObjectId } = require('mongodb');
const {getdb}=require('./serverconnection');


class roomfile{
  //fxn to save file (code) to db collection roomfile
  static savefile(data){
    const _db=getdb();
    return _db.collection('roomfile').insertOne(data);
  }
  //fxn to find data with id
  static findme(id){
    const _db=getdb();
    return _db.collection('roomfile').find({roomid:new ObjectId(id)}).toArray();
  }
  static findfile(id){
    const _db=getdb();
    return _db.collection("roomfile").find({_id:new ObjectId(id)}).next();
  }
  static delfile(id){
    const _db=getdb();
    return _db.collection("roomfile").deleteOne({_id:new ObjectId(id)});
  }
  //updating the exsisting data
  static updateme(id,data){
    const _db=getdb();
    return _db.collection('roomfile').updateOne({ _id:new ObjectId(id)},{$set:data});
  }
}


exports.roomfile=roomfile;