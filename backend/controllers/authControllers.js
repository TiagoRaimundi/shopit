import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";


//Register user => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name, email, password
    });

    sendToken(user, 201, res)


    const token = user.getJwtToken();
    res.status(201).json({
        token,
    });
});



//Login user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    //Find user in the database
    const user = await User.findOne({ email }).select("+password")

    if(!user){
        return next(new ErrorHandler('Invalid email or passoword', 401))
    }

    //check if password is correct
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }


    sendToken(user, 201, res);

});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }); 

    res.status(200).json({
        message: "Logged Out",
    })
})


//forgot password => /api/v1/login
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // Encontrar usuário no banco de dados
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Obter o token de redefinição de senha
    const resetToken = user.getResetPasswordToken(); 
    await user.save(); // Salvar o token no banco de dados

    // Criar URL de redefinição de senha
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = getResetPasswordTemplate(user.name, resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIt password recovery',
            message,
        });

        res.status(200).json({
            message: `Email sent to: ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save(); // Garantir que a limpeza é salva no DB
        return next(new ErrorHandler('Email could not be sent.', 500));
    }
});
