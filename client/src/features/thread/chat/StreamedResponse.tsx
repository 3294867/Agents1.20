import Paragraph from "src/components/paragraph";
import hooks from "src/hooks";

const StreamedResponse = () => {
    const { stream } = hooks.features.useThreadContext();
    return <Paragraph style={{ lineHeight: "2" }}>{stream}</Paragraph>;
};

export default StreamedResponse;
