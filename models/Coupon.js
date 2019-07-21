const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const Coupon = new Schema({
  product_id:Schema.Types.ObjectId,
  couponCode:String,
  discountedPrice:Number,
  status:{
    type:Boolean,
    default:true
  },
  vendor:String,
  productUrl:String
});

module.exports = mongoose.model('coupon',Coupon);