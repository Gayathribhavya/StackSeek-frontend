/**
 * Shared API interfaces between client and server
 */

export interface Repository {
  id: string;
  name: string;
  url: string;
  isPrivate: boolean;
  status: "connected" | "error" | "pending";
  errors?: number;
  lastAnalysis?: string;
}

export interface ErrorAnalysisRequest {
  repositoryId: string;
  errorMessage: string;
  stackTrace?: string;
  context?: string;
}

export interface AnalysisResult {
  id: string;
  errorType: string;
  severity: "low" | "medium" | "high";
  summary: string;
  description: string;
  suggestions: string[];
  codeExample?: string;
  relatedFiles: string[];
  timestamp: string;
}

export interface ConnectRepositoryRequest {
  url: string;
  isPrivate: boolean;
  authMethod?: "token" | "credentials" | "ssh" | "deploy" | null;
  authData?: {
    token?: string;
    username?: string;
    password?: string;
    sshKey?: string;
    deployKey?: string;
  } | null;
}

export interface ConnectRepositoryResponse {
  success: boolean;
  repository: Repository;
  message: string;
}

export interface UserRepositoriesResponse {
  repositories: Repository[];
}

export interface ErrorAnalysisResponse extends AnalysisResult {}
