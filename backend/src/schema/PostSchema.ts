import {z} from "zod";

export const PostSchema=z.object({
    title:z.string(),
    content:z.string().optional()
})

export const updatePostSchema=z.object({
     title:z.string().optional(),
    content:z.string().optional()
})