const nodemailer=require('nodemailer');

const Transporter=nodemailer.createTransport({
  service:"gmail",
  secure:true,
  host:"smtp.gmail.com",
  auth:{
    user:"dempro531@gmail.com",
    pass:"kmpn kjxw hzsp gasy"
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
