const { body } = require("express-validator");

const registerValidation = [
    body("email","Incorrect email format").isEmail(),
    body("password","Password should be not less than 7 symbols").isLength( { min : 6, max : 25 } ),
    body("username","Username should be min 6 symbols ").isLength( { min : 6, max : 35 } )
]

const loginValidation = [
    body("email","Incorrect email format").isEmail(),
    body("password","Password should be not less than 8 symbols").isLength( { min : 8, max : 25 } )
]

module.exports = {
    loginValidation,
    registerValidation
}