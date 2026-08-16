const {roomouterclass}=require('../models/dbfxnroom');
const {outerclass}=require('../models/dbfxn');
const {roomfile}=require('../models/roomfilefxn');
const { ObjectId } = require('mongodb');

exports.saveroom=async (req,res,next)=>{
  const data=req.body;
  console.log('data is this ',data);
  const result=await roomouterclass.saveroom(data);
  const userdata=await outerclass.findbyid(data.hostid);
  let updatedresult;
  //updating room info in userdetails 
  if (userdata.mycurrentroom===0){
    const usernewdata={
      _id:userdata._id,
      mycurrentroom:Number(userdata.mycurrentroom)+1,
      room:[result.insertedId]
    }
    console.log("new user data is this ",usernewdata);
     updatedresult=await outerclass.updateuserroom(usernewdata);
  }else{
    const usernewdata={
      _id:userdata._id,
      mycurrentroom:Number(userdata.mycurrentroom)+1,
      room:[...userdata.room,result.insertedId]
    }
     updatedresult=await outerclass.updateuserroom(usernewdata);
  }
  console.log(updatedresult);
  if (updatedresult.acknowledged===true){
    res.json(updatedresult)
  }
}

//get saved rooms
exports.getroom=async (req,res,next)=>{
  const userid=req.params.id;
  const userdetails=await outerclass.findbyid(userid);
  console.log('user contain the following room',userdetails);
  console.log('array with room id is ',userdetails.room);
  //fetching all rooms
  const result=await roomouterclass.findbyroomids(userdetails.room);
  let code_room_array=[];
  result.map(obj=>{if (obj.type==="Code"){
    code_room_array.push(obj);
  }})
  console.log("user enrolled rooms are",code_room_array);
  res.json(code_room_array);
}

//get Interview rooms
exports.getinterviewrooms=async (req,res,next)=>{
  const userid=req.params.id;
  const userdetails=await outerclass.findbyid(userid);
  let Interviewarrayrooms=[];
  if (userdetails!=null){
    const roomsdetails=await roomouterclass.findbyroomids(userdetails.room);
    roomsdetails.map(obj=>{
      if (obj.type==="Interview"){
        Interviewarrayrooms.push(obj);
      }
    })
    res.json(Interviewarrayrooms);
  }
}


exports.findmyroom=async (req,res,next)=>{
  const roomid=req.params.id;
  console.log('room id is ',roomid);
  const result=await roomouterclass.findmyroom(roomid);
  const roomfiles=await roomfile.findme(roomid);
  if (result && roomfiles){
    res.json({
    roominfo:result,
    roomfiles:roomfiles
  });
  }else{
    res.json({
      status:false
    })
  }
}

exports.savefile=async (req,res,next)=>{
  const data=req.body;
  let savingdata={
      filename:data.filename,
      roomid:new ObjectId(data.roomid),
      saver:data.saver,
      code:data.code   
    }
    const finalresult=await roomfile.savefile(savingdata);
    if (finalresult){
          res.json({
            status:true
          })
}
}
//deleteing room 
exports.deleteroom=async (req,res,next)=>{
  const roomid=req.params.id;
  const result=await roomouterclass.deleteroom(roomid);
  console.log(result);
  if (result.deletedCount==true){
    res.json({
      status:true,
    })
  }else{
    res.json({
      status:false,
    })
}
  }

//update room info
exports.updateroominfo=async (req,res,next)=>{
  const roomid=req.params.id;
  const data=req.body;
  const dataforhost=await roomouterclass.findmyroom(roomid);
  const result=await roomouterclass.updateroominfo(roomid,data);
  if (result.acknowledged==true){
    res.json({
      status:true,
      userid:dataforhost.hostid
    })
  }else{
    res.json({
      status:false,
      userid:dataforhost.hostid
    })
  }

}
//finding user hosted rooms
exports.hostedrooms=async (req,res,next)=>{
  const userid=req.params.id;
  const result=await roomouterclass.findhostedrooms(userid);
  res.json(result);
}

//outer finder for code in the room
exports.outputFinder=async (req,res,next)=>{
  const data=req.body;
  const langmap={
    cpp: "0",
    c: "0",
    java: "2",
    python3: "3",
    nodejs: "4"
  }
  const responce=await fetch("https://api.jdoodle.com/v1/execute",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      "clientId": "395538b16e9e855a6bd01189e087f1c1",
      "clientSecret": "e44c3101415a79904cf029a915e946bf1f62ddb4e8088ad387ea2494c03f4bdd",
      "script": data.code,
      "language":data.language,
      "versionIndex": langmap[data.language]||0
    })
  })
  const result=await responce.json();
  res.json(result);

}



exports.delroomfile=async (req,res,next)=>{
  const id=req.params.id;
  console.log("room file id is this ",id);
  const result=await roomfile.delfile(id);
  console.log("del results",result);
  if (result.acknowledged===true){
    res.json({
      status:true
    })
  }else{
    res.json({
      status:false
    })
  }
}

//to upadate the roomfile code 

exports.filecodeupdater=async (req,res,next)=>{
  const id=req.params.id;
  const data=req.body;
  const result=await roomfile.updateme(id,data);
  console.log("id is this",id,result);
  if (result.modifiedCount===1){
    res.json({
      status:true
    })
  }else{
    res.json({
      status:false
    })
  }
}

//finding user joined room
exports.findJoinedRoom=async (req,res,next)=>{
  const data=req.body;
  console.log("data isthis ",data);
  if (data.length=="0"){
    res.json([]);
  }
  let roomidarray=[];
  data.map(obj=>{
    roomidarray.push(new ObjectId(obj));
  })
  const result=await roomouterclass.findbyroomids(roomidarray);
  if (result && result.length>0){
    res.json(result);
  }else {
    res.json([]);
  }
}

//to delete the room id from user details
exports.deleteroomId=async (req,res,next)=>{
  const id=req.params.id;               //this is room id
  const userid=req.params.userid;
  const userdetails=await outerclass.findbyid(userid);
  if (userdetails!==null){
    const newRoomArray=userdetails.room.filter(_id=>_id!=id);
    const obj={
      _id:userid,
      room:newRoomArray,
      mycurrentroom:Number(userdetails.mycurrentroom)-1
    }
    const result=await outerclass.updateuserroom(obj);
    console.log("result is this ",result);
    if (result.modifiedCount===1){
      res.json({
        status:true
      })
    }
  }else{
    res.json({
      status:false
    })
  }
}