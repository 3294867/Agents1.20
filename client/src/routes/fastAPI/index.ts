import blocks from "./blocks";
import createTextResponse from "./createTextResponse";
import createBulletListResponse from "./createBulletListResponse";
import createTableResponse from "./createTableResponse";
import createResponse from "./createResponse";

const fastAPI = {
    blocks,
    createTextResponse,
    createBulletListResponse,
    createTableResponse,
    createResponse
};

export default fastAPI;
