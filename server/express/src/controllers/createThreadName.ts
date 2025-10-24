import { Request, Response } from "express";
// import { client } from "../index";
import utils from '../utils';
import fastAPI from '../fastAPI';

interface RequestBody {
  question: string;
  answer: string;
}

const createThreadName = async (req: Request, res: Response): Promise<void> => {
  const { question, answer }: RequestBody = req.body;

  const validationError = utils.validate.createThreadName({ question, answer });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });
  
  try {
    const createThreadName = await fastAPI.createThreadName({ question, answer });
    if (!createThreadName) return utils.sendResponse({ res, status: 404, message: "Failed to create thread name" });

    res.status(200).json({
      message: "Thread name created",
      data: createThreadName
    });
  } catch (error) {
    console.error("Failed to create thread name: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default createThreadName;