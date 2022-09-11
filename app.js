const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', function(err){
  console.error('mongoDB error')
})

db.once('open',()=>{
  console.log("mongoDB open");
})

app.get('/',(req,res) => {
  res.send('hello')
})

app.listen(3000,( ) => {
  console.log("App is running on http://localhost:3000.");
})

