const express=require('express');
const roomrouter=express.Router();
//local modules
const roomcontroller=require('../controllers/roomcontroller');
const roomuser=require('../controllers/roomuser');

roomrouter.post('/save/room/info',roomcontroller.saveroom);
roomrouter.get('/saved/room/:id',roomcontroller.getroom);
roomrouter.get('/saved/interview/:id',roomcontroller.getinterviewrooms);
roomrouter.get('/code/room/:id',roomcontroller.findmyroom);
roomrouter.post('/invite/user',roomuser.inviteuser);
roomrouter.post('/accepted/request/:id',roomuser.acceptUpdater);
roomrouter.post('/save/file',roomcontroller.savefile);
roomrouter.delete('/del/room/:id',roomcontroller.deleteroom);
roomrouter.put('/update/room/:id',roomcontroller.updateroominfo);
roomrouter.get('/hosted/rooms/:id',roomcontroller.hostedrooms);
roomrouter.post("/fetch/output",roomcontroller.outputFinder);
roomrouter.delete("/del/roomfile/:id",roomcontroller.delroomfile);
roomrouter.put('/update/file/code/:id',roomcontroller.filecodeupdater);
roomrouter.post("/find/user/joined/rooms",roomcontroller.findJoinedRoom)
roomrouter.delete("/del/saved/id/:id/from/user/:userid",roomcontroller.deleteroomId);
module.exports=roomrouter;