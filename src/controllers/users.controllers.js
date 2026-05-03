import {asyncHandler} from '../utils/asyncHandler.js';


const registerUser = asyncHandler(async (req, res) => {
    // const {name, email, password} = req.body;
    // Here you would typically add logic to save the user to the database
    // For demonstration, we'll just return the user data
    res.status(201).json({message: 'User registered successfully'});
});

// const loginUser = asyncHandler(async (req, res) => {
//     const {email, password} = req.body;
//     // Here you would typically add logic to authenticate the user
//     // For demonstration, we'll just return a success message
//     res.status(200).json({message: 'User logged in successfully', user: {email}});
// });


export {registerUser};