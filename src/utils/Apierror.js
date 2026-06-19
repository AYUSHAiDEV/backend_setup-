class ApiError extends Error {
    constructor(
        statusCode,
        message = "SOMETHING WENT WRONG",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.errors = errors;

        // ✅ if block CONSTRUCTOR KE ANDAR hona chahiye
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    withContext(context){
        this.context=context
        return this
    }

    witherrors(errors){
        this.errors=[...this.errors,...errors]
        return this
    }
    toJSON(){
        return {
            success:false,
            statusCode:this.statusCode,
            message:this.message,
            errors:this.errors,
            ...(this.context && {context:this.context})
        }
    }
}