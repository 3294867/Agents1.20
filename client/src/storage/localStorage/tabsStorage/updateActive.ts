import dispatchEvent from "src/events/dispatchEvent";
import { Tab } from "src/types";

interface Props {
    workspaceName: string;
    agentName: string;
    tabId: string;
}

const updateActive = ({ workspaceName, agentName, tabId }: Props): void => {
    try {
        const loadSavedTabs = localStorage.getItem(
            `${workspaceName}_${agentName}_tabs`,
        );
        if (loadSavedTabs) {
            const updatedTabs = JSON.parse(loadSavedTabs).map((i: Tab) =>
                i.id === tabId
                    ? { ...i, isActive: true }
                    : { ...i, isActive: false },
            );

            localStorage.setItem(
                `${workspaceName}_${agentName}_tabs`,
                JSON.stringify(updatedTabs),
            );
            dispatchEvent.tabsUpdated();
        }
    } catch (err) {
        console.error(`Failed to udpate active tab (tabsStorage): `, err);
    }
};

export default updateActive;
