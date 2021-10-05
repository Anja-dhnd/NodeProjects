const express = require('express');
const monk = require('monk');

// create scheme to validate incoming answers

const joi = require('@hapi/joi');
const Joi = require('@hapi/joi');

const scheme = Joi.object({
  question: Joi.string().trim().required(),
  answer: Joi.string().trim().required(),

});

// connect monk(or mongoose) to db

const db = monk(process.env.MONGO_URI);
// connect to a special collection
const faqs = db.get('faqs');

const router = express.Router();

// all folders

router.get('/', async (req, res, next) => {
  try {
    const items = await faqs.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// read one

router.get('/:id', async (req, res, next) => {
  try {
   const {id} = req.params;
   const item = await faqs.findOne({
     _id: id,
   });
   if(!item) return next();
  } catch (error) {
    next(error);
  }
});

// create one

router.post('/', async (req, res, next) => {
  try {
    const value = await scheme.validateAsync({req.body}); 
    const inserted = await faqs.insert(value);
    res.json(value);
  } catch (error) {
    next(error);
  }
});

// update one

router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const value = await scheme.validateAsync({req.body}); 
    const item = await faqs.findOne({
      _id: id,
    });
    if (!item) return next ();
     await faqs.update({
      _id:id,
    }, {
      $set: 
        value,
      
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// delete one

router.delete('/:id', (req, res, next) => {
  res.json({
    message: 'hiiii from delete',
  });
});

module.exports = router;
