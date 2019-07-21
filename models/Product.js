const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
  brand:{
    type:String,
    required:[true,'{PATH} this field required.']
  },
  brandId:Schema.Types.ObjectId,
  productName:{
    type:String,
    required:[true,'{PATH} this field required.']
  },
  imgUrl:String,
  status:{
    type:Boolean,
    default:true
  },
  regularPrice:Number,
  lastCouponDate:{
    type:Date,
    default:Date.now
  }

 
});

module.exports = mongoose.model('product',Product);