import { Context,Next } from "hono";
import { verify } from "hono/jwt";

export const AuthMiddlleware=async (c:Context,next:Next)=>{

    const header=c.req.header("Authorization");
    
    if(!header?.startsWith("Bearer") || !header){
        return c.json({
            success:false,
            msg:"Authorization header is missing or does not start with Bearer"
        },401)
    }

    const jwtToken=header.split(" ")[1];

     if (!jwtToken) {
    return c.json({
      success: false,
      msg: "Token is missing from Authorization header"
    }, 401);
  }

    
    try {
        const vaillidToken=await verify(jwtToken,c.env.JWT_SECRET,"HS256");
        
    if(!vaillidToken || !vaillidToken.userId){
    return c.json({
            success:false,
            msg:"token is missing "
        },401)
   }

    // store userId in context; set expects two arguments: key and value
    c.set("userId",vaillidToken.userId);

    await next();

    
   } catch (error) {
     return c.json({
      success: false,
      msg: "Token is invalid or has expired"
    }, 401);
   }
    

}