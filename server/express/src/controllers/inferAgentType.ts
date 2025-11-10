import { Request, Response } from "express";
import utils from "../utils";
import fastAPI from "../fastAPI";

interface RequestBody {
    input: string;
}

const inferAgentType = async (req: Request, res: Response): Promise<void> => {
    const { input }: RequestBody = req.body;

    const validationError = utils.validate.inferAgentType({ input });
    if (validationError)
        return utils.sendResponse({
            res,
            status: 400,
            message: validationError,
        });

    try {
        const inferAgentType = await fastAPI.inferAgentType({ input });
        if (!inferAgentType)
            return utils.sendResponse({
                res,
                status: 404,
                message: "Failed to infer agent type",
            });

        res.status(201).json({
            message: "Agent type inferred",
            data: inferAgentType,
        });
    } catch (error) {
        console.error("Failed to infer agent type: ", error);
        utils.sendResponse({
            res,
            status: 500,
            message: "Internal server error",
        });
    }
};

export default inferAgentType;
