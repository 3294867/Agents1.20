import { memo } from 'react';
import Paragraph from 'src/components/paragraph';
import { ResponseType } from 'src/types';
import createColumns from './createColumns';
import AnswerTable from './AnswerTable';

const AnswerTemp = memo(({responseBody}: {responseBody: {type: ResponseType, content: string }[]}) => {
    return responseBody.map(i => <Item key={i.content} item={i} />);
});

export default AnswerTemp;

const Item = memo(({item}: {item: {type: ResponseType, content: string}}) => {
    if (item.type === 'text') {
        return <Paragraph style={{ lineHeight: '2' }}>{item.content}</Paragraph>
    } else if (item.type === 'bullet-list') {
        return <BulletList content={item.content} />
    } else {
        const parsedColumns = JSON.parse(item.content).columns;
        const columns = createColumns({ columns: parsedColumns });
        const rows = JSON.parse(item.content).rows;
        return <AnswerTable columns={columns} data={rows}/>;
    }
});

const BulletList = memo(({content}: {content: string}) => {
    return null;
});