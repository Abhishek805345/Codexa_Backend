
const {roomouterclass}=require('../models/dbfxnroom');
const {outerclass}=require('../models/dbfxn');
//importing fxn to send mail
const {sendmail}=require('../utils/mailer');
const { ObjectId } = require('mongodb');


//invite user to room
exports.inviteuser=async (req,res,next)=>{
 const data=req.body;
 console.log('this is the data send by the frontend',data);
 //checking user existance 
 const user=await outerclass.findbyemail(data.email);
 if (user!=null){
  const mail=await sendmail(data.email,"Invitation Notification",`
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <title>Room Invitation</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
      <tr>
      <td align="center">

      <!-- Main Card -->
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
      <td style="background:#2563eb; padding:20px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:22px;">
      You’re Invited 🎉
      </h1>
      </td>
      </tr>

      <!-- Body -->
      <tr>
      <td style="padding:30px; color:#333333;">
      <p style="font-size:16px; margin:0 0 12px;">
      Hello,
      </p>

      <p style="font-size:15px; line-height:1.6; margin:0 0 20px;">
      <strong>${user.username}</strong>, you have been invited to join a room on our platform.
      </p>

      <p style="font-size:15px; line-height:1.6; margin:0 0 25px;">
      Click the button below to accept the invitation and enter the room.
      </p>

      <!-- Button -->
      <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
      <td align="center">
      <form method="POST" action=${"http://localhost:3001/api/accepted/request/"+user._id}
      style="background:#2563eb; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
      <input type="hidden" value=${data.roomId} name="roomId"/>
      <button type="submit">Join Room</button>
      </form>
      </td>
      </tr>
      </table>

      <p style="font-size:14px; color:#555555; margin:30px 0 0;">
      If you were not expecting this invitation, you can safely ignore this email.
      </p>
      </td>
      </tr>

      <!-- Footer -->
      <tr>
      <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#666666;">
      © 2026 Your Platform Name. All rights reserved.
      </td>
      </tr>

      </table>

      </td>
      </tr>
      </table>

      </body>
      </html>

      `);
      if (mail!=null){
  res.json({
    status:true
  })
 }else{
  res.json({
    status:false
  })
 }
 }
 
 
}


exports.acceptUpdater=async (req,res,next)=>{
  const userId=req.params.id;
  const data=req.body;
  let roomarray=[];
  console.log("all over data is this",userId,data);
  const roomdetails=await roomouterclass.findmyroom(data.roomId);
  const userdetails=await outerclass.findbyid(userId);
  roomarray=[...userdetails.room];
  if (userdetails!=null){
    roomarray.push(new ObjectId(data.roomId));
    const obj={
      mycurrentroom:Number(userdetails.mycurrentroom)+1,
      room:roomarray
    }
    const roomobj={
      currentuser:Number(roomdetails.currentuser)+1
    }
    const resultofRoomUpdation=await roomouterclass.updatecurrentuser(data.roomId,roomobj);
    const resultOfUpdation=await outerclass.updateuser(userId,obj);
  }
}