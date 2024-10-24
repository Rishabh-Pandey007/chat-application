
const errorMiddleware = (err, req, res, next) => {
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

const TryCatch = (passFunc)=> async(req, res, next) =>{
    try{
        await passFunc(req, res, next);
    }catch(error){
        next(error);
    }
};

const a = TryCatch();

export { errorMiddleware, TryCatch };