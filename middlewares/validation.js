const Joi = require('joi');
const jwt = require('jsonwebtoken');


const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });


  const validateCarrierSetup = (req, res, next) => {
    const combinedFiles = {
      ...req.session.files,
      ...req.files
    };
  
    const dataToValidate = {
      ...req.body,
      coi: combinedFiles['coi'],
      MCAuthority: combinedFiles['MCAuthority'],
      w9: combinedFiles['w9'],
      other: combinedFiles['other'],
      noa: combinedFiles['noa'],
      voidCheck: combinedFiles['voidCheck'],
    };
  
    const { error } = carrierSetupSchema.validate(dataToValidate, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      req.flash('validationErrors', errors);
      req.session.files = combinedFiles;
      return res.redirect(`/carriers/carrier-setup?token=${req.body.token}&data=${JSON.stringify(req.body)}`);
    }
    next();
  };
  
  

  const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ success: false, errors });
    }
    next();
  };
  


  module.exports = {
    validateCarrierSetup,
    validateLogin,
  };



  