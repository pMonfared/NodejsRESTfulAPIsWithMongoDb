const mongoose = require('mongoose');
const Joi = require('joi');

const Course = mongoose.model('Courses', new mongoose.Schema({
    name: { 
      type: String,
      required: true,
      maxlength:255,
      minlength:5,      
    },
    author: String,
    category: {
      type: String,
      required: true,
      enum: [ 'web', 'mobile', 'network'],
      lowercase: true,
      //uppercase: true,
      trim: true //remove all padding property
    },
    tags: {
      type: Array,
      validate:{
        // isAsync: true, 
        // validator: function(v, callback){
        //   // Do some Async work
        //   const result = v && v.length > 0;
        //   callback(result);
        // }, <= Deprecation
        validator: (tagsarray) => Promise.resolve(tagsarray && tagsarray.length > 0),
        message: 'A course should have at least one tag.'
      }
    },
    date: { type:Date, default: Date.now},
    isPublished: Boolean,
    price: {
      type: Number,
      min:10,
      max:200,
      required: function() { return this.isPublished },
      get: v => Math.round(v),
      set: v => Math.round(v)
    }
}));

function validateCourse(course){
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        category: Joi.string().required(),
            author: Joi.string(),
            tags: Joi.array().required(),
            isPublished: Joi.boolean(),
            price: Joi.number().min(10).max(200)
    }

    return Joi.validate(course,schema);
}

exports.Course = Course;
exports.validate = validateCourse;