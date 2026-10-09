const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;

const url="mongodb+srv://Abhi_shek:171t@firstproject.7epbjmq.mongodb.net/?appName=Firstproject";
let _db;
const connection_fxn=async(callback)=>{
  await MongoClient.connect(url).then(client=>{
      callback();
     _db=client.db('newProject');
  }).catch(error=>{
    console.log('Error:Something went wrong',error);
  })
}

const getdb=()=>{
  if (_db)
  {
    return _db;
  }else{
    console.log("_db not found");
  }
}
exports.getdb=getdb;
exports.connection_fxn=connection_fxn;
