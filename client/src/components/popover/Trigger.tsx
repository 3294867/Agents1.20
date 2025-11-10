import { cloneElement, FC, isValidElement, memo, ReactNode } from "react";
import hooks from "src/hooks";

interface Props {
    asChild?: boolean;
    children: ReactNode;
}

const Trigger: FC<Props> = memo(({ asChild, children }) => {
    const { triggerRef, setIsOpen } = hooks.components.usePopoverContext();

    const props = {
        ref: triggerRef,
        onClick: () => setIsOpen(true),
        "aria-describedby": undefined as string | undefined,
        tabIndex: 0,
    };

    if (asChild && isValidElement(children)) {
        return cloneElement(children, Object.assign({}, props, children.props));
    }

    return <span {...props}>{children}</span>;
});
Trigger.displayName = "Popover.Trigger";

export default Trigger;
