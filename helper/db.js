module.exports = ()=>{
  mongoose.connect('mongodb://**',{ useNewUrlParser: true });
  mongoose.connection.on('open',()=>{
    console.log('mongodb:connected');
  });
  mongoose.connection.on('error',(err)=>{
    console.log('mongodb:do not connected',err);
  });

  mongoose.Promise = global.Promise;

  
}