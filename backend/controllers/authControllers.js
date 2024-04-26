import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";

//Register user => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);

  const token = user.getJwtToken();
  res.status(201).json({
    token,
  });
});

//Login user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  //Find user in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or passoword", 401));
  }

  //check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 201, res);
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged Out",
  });
});

//forgot password => /api/v1/login
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Encontrar usuário no banco de dados
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
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
      subject: "ShopIt password recovery",
      message,
    });

    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save(); // Garantir que a limpeza é salva no DB
    return next(new ErrorHandler("Email could not be sent.", 500));
  }
});

//reset password => /api/v1/password/reset/: token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash do token recebido pela URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Procurar usuário com o token de redefinição de senha e que ainda não expirou
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // Verificar se encontrou algum usuário
  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  // Verificar se as senhas correspondem
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Definir a nova senha e limpar os campos de token e expiração
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Salvar as alterações no banco de dados
  await user.save();

  // Enviar resposta de sucesso
  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
  });
});


//Get current user profile => /api/v1/me
export const getUserProfile = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    user,

  })
})


//update Password=> /api/v1/me
export const updatePassword = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findById(req?.user?._id).select('+password');


  //Check the previous user password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched){
    return next(new ErrorHandler('Old Password is incorrect', 400))
  }

  user.password = req.body.password;
  user.save()


  res.status(200).json({
    success: true
  })
})

//Update User Profile=> /api/v1/me/update
export const updateProfile = catchAsyncErrors(async(req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {new: true})

  res.status(200).json({
    user, 
  })
})


//Get all Users - Admin => /api/v1/admin/users
export const allUsers = catchAsyncErrors(async(req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    users, 
  })
})

//Get User Details - ADMIN => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
  }
  res.status(200).json({
    user, 
  })
})



//Update User Details - ADMIN => /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async(req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {new: true})

  res.status(200).json({
    user, 
  })
})

//Delete User - ADMIN => /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
  }

  //TODO - Remove user avatar from cloudinary

  await user.deleteOne()

  res.status(200).json({
    success: true, 
  })
})
