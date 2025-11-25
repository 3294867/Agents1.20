import auth from "src/routes/express/auth/index";
import getWorkspaces from "src/routes/express/getWorkspaces";
import getAgentId from "src/routes/express/getAgentId";
import addAgent from "src/routes/express/addAgent";
import getAvailableAgents from "src/routes/express/getAvailableAgents";
import getAvailableAgentByType from "src/routes/express/getAvailableAgentByType";
import getThread from "src/routes/express/getThread";
import addThread from "src/routes/express/addThread";
import addPublicThread from "src/routes/express/addPublicThread";
import duplicateThread from "src/routes/express/duplicateThread";
import deleteThread from "src/routes/express/deleteThread";
import addReqRes from "src/routes/express/addReqRes";
import deleteReqRes from "src/routes/express/deleteReqRes";
import updateRequestBody from "src/routes/express/updateRequestBody";
import updateResponseBody from "src/routes/express/updateResponseBody";
import updateThreadName from "src/routes/express/updateThreadName";
import removeThreadName from "src/routes/express/removeThreadName";
import getThreadUpdatedAt from "src/routes/express/getThreadUpdatedAt";
import getAgentUpdatedAt from "src/routes/express/getAgentUpdatedAt";
import getWorkspacesUpdatedAt from "src/routes/express/getWorkspacesUpdatedAt";
import getWorkspaceId from "src/routes/express/getWorkspaceId";
import getAgent from "src/routes/express/getAgent";
import getAgentNames from "src/routes/express/getAgentNames";
import updateThreadIsBookmarked from "src/routes/express/updateIsBookmarked";
import getAgentByType from "src/routes/express/getAgentByType";
import getWorkspaceMembers from "src/routes/express/getWorkspaceMembers";
import updateMemberRole from "src/routes/express/updateMemberRole";
import getUsers from "src/routes/express/getUsers";
import inviteUser from "src/routes/express/inviteUser";
import getNotifications from "src/routes/express/getNotifications";
import acceptWorkspaceInvite from "src/routes/express/acceptWorkspaceInvite";
import declineWorkspaceInvite from "src/routes/express/declineWorkspaceInvite";
import dismissWorkspaceInvite from "src/routes/express/dismissWorkspaceInvite";
import updateReqRes from 'src/routes/express/updateReqRes';

const express = {
    auth,
    getWorkspaces,
    getWorkspaceId,
    getWorkspacesUpdatedAt,
    getAgent,
    getAgentId,
    getAgentUpdatedAt,
    getAgentNames,
    getAgentByType,
    addAgent,
    getAvailableAgents,
    getAvailableAgentByType,
    getThread,
    addThread,
    addPublicThread,
    duplicateThread,
    deleteThread,
    addReqRes,
    deleteReqRes,
    updateRequestBody,
    updateResponseBody,
    updateThreadName,
    removeThreadName,
    updateThreadIsBookmarked,
    getThreadUpdatedAt,
    getWorkspaceMembers,
    updateMemberRole,
    getUsers,
    inviteUser,
    getNotifications,
    acceptWorkspaceInvite,
    declineWorkspaceInvite,
    dismissWorkspaceInvite,
    updateReqRes
};

export default express;
