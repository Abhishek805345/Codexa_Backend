const controller=require('../controllers/homecontroller')
const express=require('express');
const router=express.Router();

router.get('/sess',controller.checksess);
router.post('/find/user',controller.finduser);
router.post('/find/after/user',controller.afterFinduser);
router.post('/save/data',controller.saveuser);
router.post('/login/check',controller.logincheck);
router.post('/email/send/otp',controller.emailotp);
router.post('/otp/validate',controller.validateotp);
router.post('/save-password',controller.savepassword);
router.get('/logout/:id',controller.logoutdone);
router.get('/user/details/:id',controller.userdetails);
router.delete('/delete/user/:id',controller.deleteuser);
router.post('/update/user/:id',controller.updateuser);


module.exports=router;