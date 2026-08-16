const nodemailer=require('nodemailer');

const Transporter=nodemailer.createTransport({
  secure:true,
  host:"smtp.gmail.com",
  auth:{
    user:"dempro531@gmail.com",
    pass:"orck orie gtmv znru"
  }
})

exports.sendmail=async (to,sub,mess)=>{
  return await Transporter.sendMail({
    from:"<Space Code>",
    to:to,
    subject:sub,
    html:mess
  })
}