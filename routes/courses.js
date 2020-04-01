
const auth = require('../middleware/authorization');
const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Course, validate } = require('../models/course')

router.get('/', async (req,res) => {
    const courses = await Course.find().sort('name');
    res.send(courses);
});

router.get('/:id', validateObjectId, async (req,res)=> {

    const course = await Course.findById(req.params.id);
    if(!course) return res.status(404).send('The course with the given ID was not found');

    res.send(course);
});


router.post('/', auth, async (req,res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);

    let course = new Course ({
        name: req.body.name,
        category: req.body.category,
        author: req.body.author,
        tags: req.body.tags,
        isPublished: req.body.isPublished,
        price: req.body.price
    });

    course = await course.save();
    res.send(course);
});


router.put('/:id', [auth, validateObjectId], async (req,res) =>{

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const course = await Course.findByIdAndUpdate(req.params.id,{
        $set:{
            name: req.body.name,
            category: req.body.category,
            author: req.body.author,
            tags: req.body.tags,
            isPublished: req.body.isPublished,
            price: req.body.price
        }
    }, { new: true }); // Optionally: get the updated document

    if(!course) return res.status(404).send('The course with the given ID was not found');

    res.send(course);
})

router.delete('/:id', [auth, admin, validateObjectId] , async (req,res)=>{
    const course = await Course.findByIdAndRemove({_id: req.params.id});
    if(!course) return res.status(404).send('The course with the given ID was not found');
    
    res.send(course);
})



module.exports = router;