type UserRole = 'admin' | 'editor' | 'viewer'

type WorkspaceMember = {
  memberId: string;
  memberName: string;
  memberRole: 'admin' | 'editor' | 'viewer';
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  userRole: UserRole;
  agentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

type AgentType = 'general' | 'data-analyst' | 'copywriter' | 'devops-helper'
type AgentModel = 'gpt-4.1' | 'gpt-4o' | 'gpt-4o-mini' | 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano' | 'gpt-5-pro'

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  model: AgentModel;
  systemInstructions: string;
  stack: string[] | [];
  temperature: number;
  webSearch: boolean;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AddAgent {
  name: string;
  type: AgentType;
  model: AgentModel;
  systemInstructions: string;
  stack: string[];
  temperature: number;
  webSearch: boolean
}

type ResponseType = 'paragraph' | 'bullet-list' | 'table'

type ReqRes = {
  requestId: string;
  requestBody: string;
  responseId: string;
  responseBody: string;
  responseType: ResponseType;
  inferredAgentType: AgentType;
  isNew: boolean;
}

interface Thread {
  id: string;
  name: string | null;
  body: ReqRes[] | [];
  isBookmarked: boolean;
  isShared: boolean;
  isActive: boolean;
  agentId: string;
  positionY: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Tab {
  id: string;
  workspaceId: string;
  agentId: string;
  name: string | null;
  isActive: boolean;
}

type NotificationType = 'workspace_invite'

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  details: object;
  createdAt: Date;
  updatedAt: Date;
}

export type {
  UserRole,
  WorkspaceMember,
  Workspace,
  AgentType,
  AgentModel,
  Agent,
  AddAgent,
  ResponseType,
  ReqRes,
  Thread,
  Tab,
  NotificationType,
  Notification,
};

