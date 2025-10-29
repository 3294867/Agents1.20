import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workspace } from 'src/types';
import express from 'src/routes/express';
import indexedDB from 'src/storage/indexedDB';

interface Props {
  userId: string;
  workspaceName: string | undefined;
}

const useHandleWorkspace = ({ userId, workspaceName }: Props): { workspaces: Workspace[] | null, error: string | null, isLoading: boolean} => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !workspaceName) {
      setError('All props are required: userId, workspaceName');
      setIsLoading(false);
      return;
    }
    
    const init = async () => {
      try {
        const getWorkspacesIDB = await indexedDB.getWorkspaces();

        const workspacesDataIDB: { id: string, updatedAt: Date}[] = [];
        for (const item of getWorkspacesIDB) {
          workspacesDataIDB.push({
            id: item.id,
            updatedAt: item.updatedAt
          });
        }

        const getWorkspacesData = await express.getWorkspacesUpdatedAt({ userId });

        if (getWorkspacesIDB.length === 0 || JSON.stringify(workspacesDataIDB) !== JSON.stringify(getWorkspacesData)) {
          const getWorkspacesPGDB = await express.getWorkspaces({ userId });
          await indexedDB.addWorkspaces({ workspaces: getWorkspacesPGDB });
          setWorkspaces(getWorkspacesPGDB);
          return;
        }

        setWorkspaces(getWorkspacesIDB);
      } catch (error) {
        setError(`Failed to set workspaces: ${error}`);
      } finally {
        setIsLoading(false);
        navigate(`/${workspaceName}/general`);
      }
    };
    init();
  },[userId, workspaceName]);

  return { workspaces, error, isLoading };
};

export default useHandleWorkspace;