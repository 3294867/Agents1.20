import { Request, Response } from "express";
import { ResponseBody } from '../types';
import { pool } from "../index";
import utils from '../utils';

interface RequestBody {
  responseId: string;
  responseBody: ResponseBody;
}

const updateResponseBody = async (req: Request, res: Response): Promise<void> => {
  const { responseId, responseBody }: RequestBody = req.body;

  const validationError = utils.validate.updateResponseBody({ responseId, responseBody });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const updateResponse = await pool.query(`
      UPDATE responses
      SET body = $1::jsonb
      WHERE id = $2::uuid
      RETURNING id;
    `, [ JSON.stringify(responseBody), responseId ]);
    if (updateResponse.rows.length === 0) return utils.sendResponse({ res, status: 503, message: "Failed to update response body" });
    
    utils.sendResponse({ res, status: 200, message: "Response body updated" });
  } catch (error) {
    console.error("Failed to update response body: ", error);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default updateResponseBody;