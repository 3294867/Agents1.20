import createIntro from './createIntro';
import createResponse from './createResponse';
import createStream from './createStream';
import createTable from './createTable';
import createThreadName from './createThreadName';
import inferAgentAndResponseTypes from './inferAgentAndResponseTypes';

const fastAPI = {
  createResponse,
  createThreadName,
  inferAgentAndResponseTypes,
  createStream,
  createTable,
  createIntro,
};

export default fastAPI;
