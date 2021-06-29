const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const Category = require('../models/category');
const fs = require('fs-extra');
const auth = require('../config/auth');
const isUser = auth.isUser;


//GET all products
router.get('/', (req, res) => {
    // router.get('/',isUser, (req, res) => {  
    Product.find((err, products) => {
        if (err) {
            console.error(err);
        }
        res.render('all_products', {
            title: 'All_products',
            products: products
        });
    });
});

//GET  products by category
router.get('/:category', (req, res) => {
    
    const categorySlug = req.params.category;

    Category.findOne({ slug: categorySlug }, (err, c) => {
        Product.find({category: categorySlug},(err, products) => {
            if (err) {
                console.error(err);
            }
            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    })
   
});


//GET product details
router.get('/:category/:product', (req, res) => {
    
    let galleryImages = "null";
    let loggedIn = (req.isAuthenticated()?true:false);
    Product.findOne({ slug: req.params.product }, (err, product) => {
        if (err) {
            console.log(err);
        }
        else {
            let galleryDir = 'public/product_images/' + product._id + '/gallery';
            fs.readdir(galleryDir, (err, files) => {
                if (err) {
                    console.log(err);
                }
                else {
                    galleryImages = files;
                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    });
                }
            });
        }
    });
   
});

    

module.exports = router;