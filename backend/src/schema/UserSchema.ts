import { z} from "zod";

 export const userSignupSchema=z.object({
    name:z.string().optional(),
    email:z.email(),
    password:z.string().min(6)
})

export const userSinginSchema=z.object({
     email:z.email(),
    password:z.string().min(6)
})

export type UserSingupSche=z.infer<typeof userSignupSchema>;

export type UserSinginSche=z.infer<typeof userSinginSchema>