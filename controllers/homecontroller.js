const { ObjectId, serialize } = require('mongodb');
const {outerclass}=require('../models/dbfxn');
//mailer
const {sendmail}=require('../utils/mailer');
const { roomouterclass } = require('../models/dbfxnroom');


//session login check 
exports.checksess=(req,res,next)=>{
  console.log("session is this",req.session.isAuthenticated);
  if (req.session.isAuthenticated){
    console.log("execution arrived");
    res.json({
      login:true,
      userdata:req.session.user
    });
  }else{
    res.json({
      login:false
    })
  }
}

exports.saveuser=async (req,res,next)=>{
  const data=req.body;
  const existing=await outerclass.findbyemail(data.email);
  const usernaemexists=await outerclass.findbyusername(data.rusername);
  if (usernaemexists==null){
     if (existing==null){
        const obj={
          username:data.username,
          rusername: data.rusername,
          email: data.email,
          password: data.password,
          mycurrentroom:0,
          room: []
        }
        const result= await outerclass.registerdata(obj);
        const mail=await sendmail(data.email,"Registration 👍",`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Registration Successful</title>
      </head>

      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0"
                style="max-width:600px; background:#ffffff; border-radius:10px; box-shadow:0 12px 30px rgba(0,0,0,0.12);">

                <!-- Header -->
                <tr>
                  <td style="background:#2563eb; padding:25px; text-align:center; color:#ffffff;">
                    <h1 style="margin:0; font-size:24px;">Welcome 🎉</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:35px; color:#333;">
                    <h2 style="margin-top:0;">Registration Successful</h2>

                    <p style="font-size:15px; line-height:1.6; color:#555;">
                      Hello,
                    </p>

                    <p style="font-size:15px; line-height:1.6; color:#555;">
                      Your account has been <strong>successfully registered</strong>.
                      You can now log in and start using our platform.
                    </p>

                    <p style="font-size:15px; line-height:1.6; color:#555;">
                      Explore rooms, collaborate with others, and manage your projects easily.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="#"
                        style="background:#2563eb; color:#ffffff; padding:12px 28px;
                                text-decoration:none; border-radius:6px; font-size:16px;">
                        Login to Your Account
                      </a>
                    </div>

                    <p style="font-size:14px; color:#777;">
                      If you did not create this account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f1f5f9; padding:20px; text-align:center;
                            font-size:13px; color:#777;">
                    © 2026 Your App Name. All rights reserved.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>

            `)
          console.log('data saveing done',result);
          req.session.user={
              _id:result.insertedId.toString(),
              username:data.username,
              rusername:data.rusername,
              email:data.email
            }
            req.session.isAuthenticated=true;
            
            console.log('sessions are',req.session);
            req.session.save(()=>{
                  res.json({
                    status:true,
                    data:req.session.user
            })
            })
        }else{
          res.json({
            status:{gmail:true}       //it means gmail already exists
          })
        }
  }else{
    res.json({
      status:false
    })
  }
}

exports.finduser=async (req,res,next)=>{
  const data=req.body;
  const result=await outerclass.findbyemail(data.email);
  console.log("request arrive here ",data.email,result);
  if (result!=null){
    res.json({
      user:true
    })
  }else {
    res.json({
      user:false
    })
  }
}

exports.afterFinduser=async (req,res,next)=>{
  const data=req.body;
  const result=await outerclass.findbyemail(data.email);
  if (result!=null){
    res.json(result);                                       //there is a user with this email that's why he logged in
  }
}

exports.logincheck=async (req,res,next)=>{
  const data=req.body;
  const result=await outerclass.findbyemail(data.email);
  if (result.password===data.password){
    req.session.user={
      _id:result._id.toString(),
      username:result.username,
      rusername:result.rusername,
      email:result.email
    }
    req.session.isAuthenticated=true;
    
    console.log('sessions are',req.session);
    req.session.save(()=>{
          res.json({
            password:true,
            data:result
    })
    })
  }
  else{
    res.json({
      password:false,
    })
  }
}
//email check send otp
let otp;
exports.emailotp=async (req,res,next)=>{
  const data=req.body;
  console.log(data);
    otp=Math.floor(1000+Math.random()*9000);
    const otpresult=await sendmail(data.email,"Forgot Password 🔐",`Your one time otp you generating the new password is ${otp}`);
    if (otpresult!=null){
      res.json({
      otpstatus:true,
    })
    }else{
    res.json({
      otpstatus:false
    })
  }
}
//otp validator
exports.validateotp=async (req,res,next)=>{
  const userotp=req.body;
  console.log("user otp is ",userotp);
  if (userotp.otp==otp){
    res.json({
      forgoting:true
    })
  }else{
    res.json({
      forgoting:false
    })
  }
}
//saving the new. password
exports.savepassword=async (req,res,next)=>{
  const data=req.body;
  console.log('fetched data is ',data);
  const obj={
    password:data.password
  }
  const result=await outerclass.savepassword(data.email,obj);
  console.log("saved data is ",result);
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
//logout controller
exports.logoutdone=async (req,res,next)=>{
  const id=req.params.id;
  console.log("user id is ",id);
  req.session.login=false;
  req.session.id=id;
  console.log("final sessions are",req.session)
  res.json(req.session);
}

exports.userdetails=async (req,res,next)=>{
  const id=req.params.id;
  const result=await outerclass.findbyid(id);
  console.log('user details are ',result);
  res.json(result);
}
//delete user details
exports.deleteuser=async (req,res,next)=>{
  const userid=req.params.id;
  //find user hosted rooms and delete them
  const userhostedroom=await roomouterclass.delbyhostid(userid);
  //deleting user finally
  const result=await outerclass.deleteuser(userid);
  console.log('deletation result is this',result)
  if (result){
    res.json({
      status:true
    })
  }else{
    res.json({
      status:false
    })
  }
}

//updating user details 
exports.updateuser=async (req,res,next)=>{
  const userid=req.params.id;
  const data=req.body;
  const result=await outerclass.updateuser(userid,data);
  if (result){
    res.json({
      status:true
    })
  }else{
    res.json({
      status:false
    })
  }
}