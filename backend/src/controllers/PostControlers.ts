import { Context } from "hono";
import { PostSchema } from "../schema/PostSchema.js";
import { getPrisma } from "../db/prisma.js";

export const AddPost = async (c: Context) => {
  try {
    const body = await c.req.json();

    const vailidInputs = PostSchema.safeParse(body);

    if (!vailidInputs.success) {
      return c.json(
        {
          success: false,
          msg: "Invailid Inputs",
          error: vailidInputs.error.name,
        },
        400,
      );
    }

    const { title, content } = vailidInputs.data;

    const authorId = c.get("userId");

    const prisma = getPrisma(c.env.DATABASE_URL);

    const res = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json(
      {
        success: true,
        msg: "post created succefully",
        data: res,
      },
      200,
    );
  } catch (error) {
    console.error("Error creating post:", error);

    return c.json(
      {
        success: false,
        msg: "sorry server error try again",
      },
      500,
    );
  }
};

export const UpdatePost = async (c: Context) => {
  try {
    interface updateData {
      title?: string;
      content?: string;
    }

    const body: updateData = await c.req.json();

    const vailidInputs = PostSchema.safeParse(body);

    if (!vailidInputs.success) {
      return c.json(
        {
          success: false,
          msg: "Invailid Inputs",
        },
        400,
      );
    }

    const { title, content } = body;
    const userId = c.get("userId");
    const prisma = getPrisma(c.env.DATABASE_URL);

    const res = await prisma.post.updateMany({
      where: {
        authorId: userId,
      },
      data: {
        title,
        content,
      },
    });

    return c.json(
      {
        success: true,
        msg: "data Updated successfully",
      },
      201,
    );
  } catch (error) {
    console.log("got an error ", error);

    return c.json(
      {
        success: false,
        msg: "server error ",
      },
      500,
    );
  }
};

export const getPosts = async (c: Context) => {
  try {
    const getUser = c.get("userId");

    const prisma = getPrisma(c.env.DATABASE_URL);
    const res = await prisma.post.findMany({
      where: {
        authorId: getUser,
      },
    });

    return c.json({
      success: true,
      msg: "got all the post",
      post: res,
    });
  } catch (error) {
    console.log("got an error ", error);

    return c.json(
      {
        success: false,
        msg: "server error ",
      },
      500,
    );
  }
};

export const getPost = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    const userId = c.get("userId");

    const prisma = getPrisma(c.env.DATABASE_URL);

    const res = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!res) {
      return c.json({
        success: false,
        msg: "sorry no post found",
      });
    }

    return c.json({
      success: true,
      msg: "got you post",
      post: res,
    },200);
  } catch (error) {
    console.log("got an error ", error);

    return c.json(
      {
        success: false,
        msg: "server error ",
      },
      500,
    );
  }
};

export const deletePosts = async (c: Context) => {
  try {
    const getUser = c.get("userId");

    const prisma = getPrisma(c.env.DATABASE_URL);
    const res = await prisma.post.deleteMany({
      where: {
        authorId: getUser,
      },
    });

    return c.json({
      success: true,
      msg: "deleted all the post of user ",
      post: res,
    },200);
  } catch (error) {
    console.log("got an error ", error);

    return c.json(
      {
        success: false,
        msg: "server error ",
      },
      500,
    );
  }
};

export const deletePost = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    const userId = c.get("userId");

    const prisma = getPrisma(c.env.DATABASE_URL);

    const res = await prisma.post.delete({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!res) {
      return c.json(
        {
          success: false,
          msg: "sorry not abel to delete",
        },
        403,
      );
    }

    return c.json(
      {
        success: true,
        msg: "deleted you post",
        post: `your post id ${res.id} ${res.title}  is deleted successfully`,
      },
      200,
    );
  } catch (error) {
    console.log("got an error ", error);

    return c.json(
      {
        success: false,
        msg: "server error ",
      },
      500,
    );
  }
};
