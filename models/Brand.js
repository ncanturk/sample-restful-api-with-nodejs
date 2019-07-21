const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const Brand = new Schema({
  name:{
    type:String,
    minlength:1,
    maxlength:20
  },
  imgUrl:String
});

module.exports = mongoose.model('brand',Brand);