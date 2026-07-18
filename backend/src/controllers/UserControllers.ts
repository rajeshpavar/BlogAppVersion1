import { Context } from "hono";
import { userSignupSchema, userSinginSchema } from "../schema/UserSchema.js";
import { getPrisma } from "../db/prisma.js";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";


export const UserSingup=async (c:Context)=>{

   try {
     const body=await c.req.json();

    const vailidInputs=userSignupSchema.safeParse(body)

    if(!vailidInputs.success){
        return c.json({
            success:false,
            msg:"inputs are invailid ",
            error:vailidInputs.error
        },400)
    }

    const {email,name,password}=vailidInputs.data;

    const prisma=getPrisma(c.env.DATABASE_URL);

            const existingUser = await prisma.user.findFirst({
            where: {
                email,
            }
        });

    if(existingUser){
        return c.json({
            success:false,
            msg:"User Already Exisit Please SigIn instead"
        },400)
    }

    const hashPassword=await bcrypt.hash(password,10)


    const res=await prisma.user.create({
        data:{
            name,
            email,
            password:hashPassword
        }
    })

    const {password:_,...userDetails}=res
    const token=await sign({userId:res.id},c.env.JWT_SECRET)

    return c.json({
        success:true,
        user:userDetails,
        token
    },201)


   } catch (error) {
         console.log("Server Error ", error)
        return c.json({
            success:false,
            msg:"An unexpected error occurred. Please try again later."
        },500)
   }

}


export const UserSignin=async (c:Context)=>{

    const body=await c.req.json();

    const vailidInputs=userSinginSchema.safeParse(body);

    if(!vailidInputs.success){
       return c.json({
        success:false,
        msg:"Invailid Inputs",
        error:vailidInputs.error.name
       },400)
    }

    const {email,password}=vailidInputs.data;

    const prisma=getPrisma(c.env.DATABASE_URL)

    const existingUser=await prisma.user.findFirst({
        where:{
            email
        }
    })

    if(!existingUser){
        return c.json({
            success:false,
            msg:"User Does not Exist Singup"
        },400)


    }

    const vailidPassword=await bcrypt.compare(password,existingUser.password);

    if(!vailidPassword){
        return c.json({
            success:false,
            msg:"Invailid Password"
        },403)


    }

    const token=await sign({userId:existingUser.id},c.env.JWT_SECRET);
    const {password:_,...userDetails}=existingUser

    return c.json({
        success:true,
        user:userDetails,
        token
        
    },201)



}