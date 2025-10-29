import { useEffect, useState } from 'react';
import express from 'src/routes/express';

interface Props {
  workspaceId: string;
}

interface Return {
  agentNames: string[] | null;
  error: string | null;
  isLoading: boolean;
}

const useHandleAgentsDropdown = ({ workspaceId }: Props): Return => {
  const [agentNames, setAgentNames] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!workspaceId) {
      setError('All props are required: workspaceId');
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        const getAgentNamesPGDB = await express.getAgentNames({ workspaceId });
        setAgentNames(getAgentNamesPGDB);
      } catch (error) {
        setError(`Failed to fetch agent names: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [workspaceId]);

  return { agentNames, error, isLoading };
};

export default useHandleAgentsDropdown;
