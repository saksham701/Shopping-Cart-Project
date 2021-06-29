const express = require('express');
const router = express.Router();
const Product = require('../models/products');


//GET add product to cart
router.get('/add/:product', (req, res) => {

    let slug = req.params.product;


    Product.findOne({ slug: slug }, (err, product) => {
        if (err) {
           console.log(err);
        }
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                quantity: 1,
                price: parseFloat(product.price).toFixed(2),
                image: '/product_images/' + product.id + '/' + product.image,
            })
        }
        else {
            
            let newItem = true;

            for (let i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].title == slug) {
                    req.session.cart[i].quantity++;
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                req.session.cart.push({
                    title: slug,
                    quantity: 1,
                    price: parseFloat(product.price).toFixed(2),
                    image: '/product_images/' + product.id + '/' + product.image,
                });
            }
        }
        // console.log(req.session.cart);
        req.flash('success', 'Product Added to cart');
        res.redirect('back');
    });
});

//GET checkout page

router.get('/checkout', (req, res) => {

    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    }
    else {
        res.render('checkout', {
            title: 'Checkout',
            cart: req.session.cart
        });
    }
});

//GET update product

router.get('/update/:product', (req, res) => {

    let slug = req.params.product;
    let cart = req.session.cart;
    let action = req.query.action;

    for (let i = 0; i < cart.length; i++){
        if (cart[i].title == slug) {
             
            switch (action) {
                case "add":
                    cart[i].quantity++;
                    break;
                case "remove":
                    cart[i].quantity--;
                    if (cart[i].quantity == 0) {
                        cart.splice(i, 1);
                    }
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');
});

//GET clear cart

router.get('/clear', (req, res) => {

    delete req.session.cart;
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

});



module.exports = router;