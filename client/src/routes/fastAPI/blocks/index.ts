import createBulletList from './createBulletList';
import createIntro from './createIntro';
import createOutro from './createOutro';
import createTable from './createTable';
import createThreadName from './createThreadName';
import inferAgentType from './inferAgentType';
import inferResponseType from './inferResponseType';

const blocks = {
    inferAgentType,
    inferResponseType,
    createIntro,
    createOutro,
    createBulletList,
    createTable,
    createThreadName,
};

export default blocks;