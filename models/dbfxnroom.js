const { ObjectId } = require('mongodb');
const { get } = require('../routers/authrouter');
const {getdb}=require('./serverconnection');

class roomouterclass{
  static saveroom(data){
    const _db=getdb();
    return _db.collection('roominfo').insertOne(data);
  }
  //find room by hostid
  static findbyroomids(array){
    const _db=getdb();
    return _db.collection('roominfo').find({_id:{$in:array}}).toArray();
  }
  static findmyroom(id){
    const _db=getdb();
    return _db.collection('roominfo').find({_id:new ObjectId(id)}).next();
  }
 //update currentusers
 static updatecurrentuser(id,data){
  const _db=getdb();
  return _db.collection('roominfo').updateOne({_id:new ObjectId(id)},{$set:data});
 }
 //delete room
 static deleteroom(roomid){
  const _db=getdb();
  return _db.collection('roominfo').deleteOne({_id:new  ObjectId(roomid)});
 }
 //updating the room info
 static updateroominfo(roomid,data){
  const _db=getdb();
  return _db.collection('roominfo').updateOne({_id:new ObjectId(roomid)},{$set:data});
 }
 //deleting multiple room with single fxn
 static delmanyroom(array){
  const _db=getdb();
  return _db.collection('roominfo').deleteMany({_id:{$in:array}});
 }
 //deleting room by hostid
 static delbyhostid(hostid){
  const _db=getdb();
  return _db.collection('roominfo').deleteOne({hostid:hostid});
 }
 //finding user hosted rooms
 static findhostedrooms(userid){
  const _db=getdb();
  return _db.collection('roominfo').find({hostid:userid}).toArray();
 }

}




exports.roomouterclass=roomouterclass;