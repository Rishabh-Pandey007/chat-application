import { ne } from "@faker-js/faker";
import { body, validationResult, check, param, query } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";


const validateHandler = (req, res, next) => {

    const errors =validationResult(req);

    const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

    console.log(errorMessages);

    if(errors.isEmpty())    return next();
    else next(new ErrorHandler(errorMessages), 400);
    
};


const registerValidator = () => [

    // body(["name", "username", "password", "bio"]).notEmpty(),
    //  body("name").not().isEmpty().withMessage("Name is required"),
    // body("username").not().isEmpty().withMessage("Username is required"),
    // body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    // body("bio").not().isEmpty().withMessage("Bio is required"),
    body("name", "Name is required").notEmpty(),
    body("username", "Username is required").notEmpty(),
    body("password", "Password is required").notEmpty(),
    body("bio", "Bio is required").notEmpty(),
    check("avatar","Please Upload Avatar").notEmpty(),

];


const loginValidator = () => [

    body("username", "Please provide Username").notEmpty(),
    body("password", "Please provide Password").notEmpty(),
   
];


const newGroupValidator = () => [

    body("name", "Please provide Groupname").notEmpty(),
    body("members")
    .notEmpty()
    .withMessage("Please provide members")
    .isArray({ min: 3, max: 100 })
    .withMessage("Members must be between 3 and 100"),
   
];


const addMemberValidator = () => [

    body("chatId", "Please provide Chat ID").notEmpty(),
    body("members")
    .notEmpty()
    .withMessage("Please provide members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be between 1 - 97"),
   
];


const removeMemberValidator = () => [

    body("chatId", "Please provide Chat ID").notEmpty(),
    body("userId", "Please provide User ID").notEmpty(),    
];


const sendAttachmentsValidator = () => [

    body("id", "Please provide Chat ID").notEmpty(),
    check("files")
    .notEmpty().withMessage("Please Upload Attachments")
    .isArray({ min: 1, max: 5 })
    .withMessage("Attachments must be between 1 - 5"),
];


const chatDIdValidator = () => [

    param("id", "Please provide Chat ID").notEmpty(),
];


const renameValidator = () => [

    param("id", "Please provide Chat ID").notEmpty(),
    body("name", "Please provide New Name").notEmpty(),
];


const sendRequestValidator = () => [

    body("userId", "Please enter User ID").notEmpty(),
];


const acceptRequestValidator = () => [

    body("requestId", "Please enter Request ID").notEmpty(),
    body("accept")
    .notEmpty().withMessage("Please accept")
    .isBoolean()
    .withMessage("Accept must be true or false"),
];



export { 
    registerValidator,
    loginValidator, 
    newGroupValidator, 
    addMemberValidator, 
    removeMemberValidator, 
    sendAttachmentsValidator,
    chatDIdValidator,
    renameValidator,
    sendRequestValidator,
    acceptRequestValidator,
    validateHandler 
};