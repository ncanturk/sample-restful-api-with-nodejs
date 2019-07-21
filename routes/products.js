const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//models
const Product = require('../models/Product');

//product add endpoint with promise
router.post('/add/product', (req, res) => {
  const product = new Product(req.body);
  const promise = product.save();

  promise.then((data)=>{
    res.json({status:1});
  }).catch((err)=>{
    res.json(err);
  });
});

//get items by brand
router.get('/brands/:brandId',(req,res)=>{
  const promise = Product.aggregate([
    {
      $lookup:{
        from: 'coupon',
        localField: '_id',
        foreignField: 'product_id',
        as:'coupons'
      }
    },
    {
      $unwind:{
        path:'$coupons',
        //preserveNullAndEmptyArrays: true
      }
    },
    {
      $match: {
        brandId:mongoose.Types.ObjectId(req.params.brandId)
      }
    },
    {
      $sort: {
        'lastCouponDate': 1
      }
    },
    {
      $group:{
        _id:{
          _id:'$_id',
          productName:'$productName',
          imgUrl:'$imgUrl',
          regularPrice:'$regularPrice'
        },
        coupons:{
          $push: '$coupons'
        }
      }
    },{
      $project:{
        _id:'$_id._id',
        productName:'$_id.productName',
        imgUrl:'$_id.imgUrl',
        regularPrice:'$_id.regularPrice',
        discountedPrice:'$coupons.discountedPrice'
      }
    }
  ]);


  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

//get 30 recently added products 
router.get('/recent',(req,res)=>{
  const promise = Product.aggregate([
    {
      $lookup:{
        from: 'coupon',
        localField: '_id',
        foreignField: 'product_id',
        as:'coupons'
      }
    },
    {
      $unwind:{
        path:'$coupons',
        //preserveNullAndEmptyArrays: true
      }
    },
    {
      $group:{
        _id:{
          _id:'$_id',
          productName:'$productName',
          imgUrl:'$imgUrl',
          regularPrice:'$regularPrice',
          lastCouponDate:'$lastCouponDate'
        },
        coupons:{
          $push: '$coupons'
        }
      }
    },{
      $project:{
        _id:'$_id._id',
        productName:'$_id.productName',
        imgUrl:'$_id.imgUrl',
        regularPrice:'$_id.regularPrice',
        lastCouponDate:'$_id.lastCouponDate',
        discountedPrice:'$coupons.discountedPrice'
      }
    },
    {
      $sort: {
        'lastCouponDate': -1
      }
    }
  ]).limit(30);

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

//delete with id parameter
router.delete('/delete/:product_id',(req,res,next)=>{
  const promise = Product.findByIdAndRemove(req.params.product_id,);
  
  promise.then((product)=>{
    if(!product)
      next({message:'the product was not found.',code:99});
    
    res.json({status:1});
  }).catch((err)=>{
    res.json(err);
  });
});

//update with id parameter
router.put('/update/:product_id',(req,res)=>{
  const promise = Product.findByIdAndUpdate(
    req.params.product_id,
    req.body,
    {
      new:true
    }
  );
  
  promise.then((product)=>{
    if(!product)
      next({message:'the product was not found.',code:99});

      res.json(product);
  }).catch((err)=>{
      res.json(err);
  });
});

//get product with product name parameter
router.get('/product/:productName',(req,res)=>{
  const promise = Product.find({
    status:true,
    productName : new RegExp(req.params.productName, 'i')

  },'productName')
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

//get with id parameter product detail
router.get('/productDetail/:product_id',(req,res)=>{
  const promise = Product.aggregate([
    {
      $match:{
        '_id':mongoose.Types.ObjectId(req.params.product_id)
      }
    },
    {
      $lookup:{
        from: 'coupon',
        localField: '_id',
        foreignField: 'product_id',
        as:'coupons'
      }
    },
    {
      $unwind:{
        path:'$coupons',
        //preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: {
        'coupons.discountedPrice': 1
      }
    },
    {
      $group:{
        _id:{
          /*_id:'$_id',*/
          brand:'$brand',
          productName:'$productName',
          imgUrl:'$imgUrl',
          regularPrice:'$regularPrice'
        },
        coupons:{
          $push: {
            couponCode : '$coupons.couponCode',
            discountedPrice : '$coupons.discountedPrice',
            status : '$coupons.status',
            vendor : '$coupons.vendor',
            productUrl : '$coupons.productUrl'
          }
        }
      }
    },{
      $project:{
        _id:'$_id._id',
        brand:'$_id.brand',
        productName:'$_id.productName',
        imgUrl:'$_id.imgUrl',
        regularPrice:'$_id.regularPrice',
        coupons:'$coupons'
      }
    }
  ])/*.sort({ 'coupons.vendor': 1 })*/;

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


module.exports = router;
