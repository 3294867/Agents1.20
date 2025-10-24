import { Request, Response } from "express";
import { pool } from '..';
import utils from "../utils";
import { AgentModel } from "../types";
import fastAPI from '../fastAPI';

interface RequestBody {
  agentId: string;
  agentModel?: AgentModel;
  input: string;
}

const createResponse = async (req: Request, res: Response): Promise<void> => {
  const { agentId, agentModel, input }: RequestBody = req.body;

  const validationError = await utils.validate.createResponse({ agentId, input, agentModel });
  if (validationError) return utils.sendResponse({ res, status: 400, message: validationError });

  try {
    const getAgent = await pool.query(`
      SELECT model, system_instructions
      FROM agents
      WHERE id = $1::uuid;
    `, [ agentId ]);
    if (getAgent.rows.length === 0) return utils.sendResponse({ res, status: 404, message: "Failed to get agent" });

    const response = await fastAPI.createResponse({ input });
    if (!response) return utils.sendResponse({ res, status: 404, message: "Failed to get response" });

    const responseType = await fastAPI.inferResponseType({ input });
    if (!responseType) return utils.sendResponse({ res, status: 404, message: "Failed to get response type" });

    res.status(201).json({
      message: 'Response created',
      data: {
        responseBody: response,
        responseBodyType: responseType
      }
    });
  } catch (err) {
    console.error("Failed to create response:", err);
    utils.sendResponse({ res, status: 500, message: "Internal server error" });
  }
};

export default createResponse;
