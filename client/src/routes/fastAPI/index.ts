import createResponse from './createResponse';
import createStream from './createStream';
import createThreadName from './createThreadName';
import inferAgentAndResponseTypes from './inferAgentAndResponseTypes';

const fastAPI = {
  createResponse,
  createThreadName,
  inferAgentAndResponseTypes,
  createStream,
};

export default fastAPI;
