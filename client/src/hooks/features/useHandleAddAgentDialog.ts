import { useEffect, useState } from 'react';
import { AddAgent } from 'src/types';
import express from 'src/routes/express';

interface Props {
  workspaceId: string;
}

const useHandleAddAgentDialog = ({ workspaceId }: Props): { availableAgents: AddAgent[] | null, error: string | null, isLoading: boolean } => {
  const [availableAgents, setAvailableAgents] = useState<AddAgent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!workspaceId) {
      setError("Missing required props: workspaceId");
      return;
    }

    setIsLoading(true);
    
    const getAvailableAgents = async () => {
      try {
        const getAvailableAgents = await express.getAvailableAgents({ workspaceId });
        setAvailableAgents(getAvailableAgents);
      } catch (error) {
        throw new Error(`Failed to fetch available agents: ${error}`);
      }
    };
    getAvailableAgents();

    setIsLoading(false);
  },[workspaceId]);

  return { availableAgents, error, isLoading };
};

export default useHandleAddAgentDialog;