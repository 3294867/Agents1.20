import { Request, Response } from "express";
import { pool } from "../index";
import utils from "../utils";
import { ResponseBody } from "../types";

interface RequestBody {
    threadId: string;
    responseBody: ResponseBody;
}

const updateReqRes = async (req: Request, res: Response): Promise<void> => {
    const { threadId, responseBody }: RequestBody = req.body;

    const validationError = utils.validate.updateReqRes({ threadId, responseBody });
    if (validationError) {
        return utils.sendResponse({
            res,
            status: 400,
            message: validationError,
        });
    }

    try {
        const updateResponse = await pool.query(`
            UPDATE responses
            SET body = $1::jsonb
            WHERE id = $2::uuid
            RETURNING id, body;
        `, [JSON.stringify(responseBody), threadId]);
        
        if (updateResponse.rows.length === 0) {
            return utils.sendResponse({
                res,
                status: 503,
                message: "Failed to update responseBody",
            });
        }

        res.status(201).json({
            message: "Success",
        });
    } catch (e) {
        console.error("Failed to update responseBody: ", e);
        utils.sendResponse({
            res,
            status: 500,
            message: "Internal server error",
        });
    }
};

export default updateReqRes;
