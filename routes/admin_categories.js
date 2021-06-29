const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

//GET Category model
const Category = require('../models/category');

//GET Category index
router.get('/',isAdmin ,(req, res) => {
     
    Category.find({}, (err, categories) => {
        if (err) return console.error(err);
        
        res.render('admin/categories',{categories: categories});
    });
});

//GET add-category
router.get('/add-category', isAdmin ,(req, res) => {
    const title = "";
    

    res.render('admin/add_category',{
            title: title
             
        });
});

//POST add-category
router.post('/add-category', (req, res) => {
    
    req.checkBody('title', 'Title cannot be empty').notEmpty();
    
    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();

    const errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin/add_category', {
           
            errors:errors,
            title: title
        });
    }
    else {
        Category.findOne({ slug: slug }, (err, category) => {
            if (category) {
                req.flash('danger', 'Category Title exists,choose another.');
                res.render('admin/add_category', {
                    title: title 
                });
            }
            else {
                const category = new Category({
                    title: title,
                    slug: slug,
                });
                category.save((err) => {
                    if (err) return console.log(err);

                    //get all pages to pass to header ejs
                    Category.find((err, categories) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            req.app.locals.categories = categories;
                        }
                    });

                    req.flash('success', 'Category added!');
                    res.redirect('/admin/categories');
                });
            }
        });
    }
});

//POST reorder pages
router.post('/reorder-pages', (req, res) => {
     
    const ids = req.body['id[]'];
    let count = 0;
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        count += 1;

        (function (count) {
            Page.findById(id, (err, page) => {
                page.sorting = count;
                page.save((err) => {
                    if (err) {
                       return console.log(err);
                    }

                });
            });  
        })(count);
        
    }
});

//GET edit-category
router.get('/edit-category/:id', isAdmin,(req, res) => {
    Category.findById(req.params.id, (err,category) => {
        if (err) return console.log(err);
        
        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });
    });
});

//POST edit-category
router.post('/edit-category/:id', (req, res) => {
    
    req.checkBody('title', 'Title cannot be empty').notEmpty();

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();

    let id = req.params.id;

    const errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin/edit_category', {
           
            errors:errors,
            title: title,
            id: id
        });
    }
    else {
        Category.findOne({ slug: slug,_id:{'$ne':id} }, (err, category) => {
            if (category) {
                    req.flash('danger', 'Category title exists,choose another.');
                    res.render('admin/edit_category', {
                        title: title, 
                        id: id
                    });
            }
            else {
                    Category.findById(id, (err, category) => {
                        if (err) return console.log(err);
                        
                        category.title = title;
                        category.slug = slug;

                        category.save((err) => {
                            if (err) return console.log(err);
                            
                             //get all pages to pass to header ejs
                    Category.find((err, categories) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            req.app.locals.categories = categories;
                        }
                    });

                        req.flash('success', 'Category updated!');
                        res.redirect('/admin/categories/edit-category/'+id);
                    });
                });
               
            }
        });
    }
});


//GET delete Category
router.get('/delete-category/:id', isAdmin,(req, res) => {
     
    Category.findByIdAndRemove(req.params.id, (err) => {
        if (err) return console.log(err);

         //get all pages to pass to header ejs
         Category.find((err, categories) => {
            if (err) {
                console.log(err);
            }
            else {
                req.app.locals.categories = categories;
            }
        });
        
        req.flash('success', 'Category deleted');
        res.redirect('/admin/categories/');
    });
});



module.exports = router;