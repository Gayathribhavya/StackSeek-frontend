import { RequestHandler } from "express";
import { ConnectRepositoryRequest, ConnectRepositoryResponse } from "../../shared/api";

export interface Repository {
  id: string;
  name: string;
  owner: string;
  branch: string;
  language: string;
  stars?: number;
  updated: string;
  url: string;
  private: boolean;
}

export interface RepositoriesResponse {
  success: boolean;
  repositories: Repository[];
  error?: string;
}

export const getRepositories: RequestHandler = async (req, res) => {
  // Repository fetching is handled by the .NET backend
  // Frontend should call wm3s5emyme.ap-south-1.awsapprunner.com/api/repository/user directly
  res.status(501).json({
    success: false,
    repositories: [],
    error: 'Repository fetching is handled by the .NET backend at wm3s5emyme.ap-south-1.awsapprunner.com/api/repository/user'
  });
};

export const connectRepository: RequestHandler = async (req, res) => {
  // This endpoint is kept for backward compatibility but actual repository
  // connections should be handled through the .NET backend at wm3s5emyme.ap-south-1.awsapprunner.com
  res.status(501).json({
    success: false,
    repository: {} as any,
    message: 'Repository connections are handled by the .NET backend at wm3s5emyme.ap-south-1.awsapprunner.com/api/repository/connect'
  });
};
