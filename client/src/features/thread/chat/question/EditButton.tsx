import { memo } from "react";
import Button from "src/components/button";
import dispatchEvent from "src/events/dispatchEvent";
import Icons from "src/assets/icons";
import hooks from 'src/hooks';

const EditButton = memo(() => {
    const {
        requestId,
        responseId,
        setIsEditing
    } = hooks.features.useQuestionContext();
    
    const handleClick = () => {
        const update = () => {
            return new Promise<void>((resolve) => {
                dispatchEvent.responsePaused({ requestId, responseId });
                setIsEditing(true);
                resolve();
            });
        };
        update().then(() => dispatchEvent.editingQuestion({ requestId }));
    };

    return (
        <Button onClick={handleClick} variant="ghost" size="icon">
            <Icons.Edit />
        </Button>
    );
});

export default EditButton;
