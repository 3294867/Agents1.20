import blocks from "./blocks";
import createTextResponse from "./createTextResponse";
import createBulletListResponse from "./createBulletListResponse";
import createTableResponse from "./createTableResponse";
import createStream from './createStream';

const fastAPI = {
    blocks,
    createTextResponse,
    createBulletListResponse,
    createTableResponse,
    createStream,
};

export default fastAPI;
