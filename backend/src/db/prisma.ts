import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";


export const getPrisma=(database_Url:string)=>{
    const connectionString=database_Url;

    const adapter:any=new PrismaPg({connectionString});
    const prisma=new PrismaClient({adapter});

    return prisma
}
