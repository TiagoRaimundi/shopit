import catchAsyncErrors from "../middleware/catchAsyncErrors";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password} = req.body;
    
})