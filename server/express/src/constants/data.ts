import { AgentModel, AgentType } from '../types';

const agentModels = [
  'gpt-4.1',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-5',
  'gpt-5-mini',
  'gpt-5-nano',
  'gpt-5-pro'
] as AgentModel[];

const agentTypes = [
  'general',
  'data-analyst',
  'copywriter',
  'devops-helper'
] as AgentType[];

const responseTypes = [ 'paragraph', 'bullet-list', 'table' ];

const data = {
  agentModels,
  agentTypes,
  responseTypes
};

export default data;