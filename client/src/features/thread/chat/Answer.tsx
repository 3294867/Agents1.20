import { memo } from "react";
import Paragraph from "src/components/paragraph";
import { ResponseType } from "src/types";
import createColumns from "./createColumns";
import AnswerTable from "./AnswerTable";
import BulletList from "src/components/bullet-list";

const Answer = memo(({responseBody}: {responseBody: { type: ResponseType; content: string }[]}) => {
    return responseBody.map((i) => <Item key={i.content} item={i} />);
});

export default Answer;

const Item = memo(({ item }: { item: { type: ResponseType; content: string } }) => {
    if (item.type === "text") {
        return <Paragraph style={{ lineHeight: "2" }}>{item.content}</Paragraph>
    } else if (item.type === "bullet-list") {
        const parsedData = JSON.parse(item.content);
        return <BulletList data={parsedData} />;
    } else {
        const parsedColumns = JSON.parse(item.content).columns;
        const columns = createColumns({ columns: parsedColumns });
        const rows = JSON.parse(item.content).rows;
        return <AnswerTable columns={columns} data={rows} />;
    }
});
