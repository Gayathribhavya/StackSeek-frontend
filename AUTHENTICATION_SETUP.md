# Authentication Setup Guide

## Current Issues Fixed

### ✅ Issues Resolved:
1. **All Git provider OAuth was broken** - Fixed by creating proper OAuth endpoints for GitHub, GitLab, Bitbucket, and Azure DevOps
2. **Manual email/password authentication should work** - Firebase is properly configured
3. **Mixed OAuth providers** - Separated all Git providers and Google OAuth with proper buttons

## Firebase Authentication

Firebase is already configured and should work for:
- ✅ Email/password registration
- ✅ Email/password login
- ✅ Google OAuth
- ✅ Email verification

## Git Provider OAuth Setup

All major Git providers are now supported. Configure any or all of them:

### 1. GitHub OAuth Setup
1. Go to https://github.com/settings/applications/new
2. Set **Application name**: `StackSeek`
3. Set **Homepage URL**: `https://stackseek.io` (or your domain)
4. Set **Authorization callback URL**: `https://stackseek.io/api/auth/github/callback`
5. Click "Register application"

### 2. GitLab OAuth Setup
1. Go to https://gitlab.com/-/profile/applications
2. Set **Name**: `StackSeek`
3. Set **Redirect URI**: `https://stackseek.io/api/auth/gitlab/callback`
4. Check scopes: `read_user`, `read_repository`
5. Click "Save application"

### 3. Bitbucket OAuth Setup
1. Go to your workspace settings: https://bitbucket.org/workspace/YOUR_WORKSPACE/settings/api
2. Click "Add consumer"
3. Set **Name**: `StackSeek`
4. Set **Callback URL**: `https://stackseek.io/api/auth/bitbucket/callback`
5. Check permissions: `Account: Read`, `Repositories: Read`
6. Click "Save"

### 4. Azure DevOps OAuth Setup
1. Go to https://app.vsaex.visualstudio.com/app/register
2. Set **Application name**: `StackSeek`
3. Set **Application website**: `https://stackseek.io`
4. Set **Authorization callback URL**: `https://stackseek.io/api/auth/azure-devops/callback`
5. Set **Authorized scopes**: `Code (read)`, `Project and team (read)`
6. Click "Create Application"

### 5. Configure Environment Variables
Copy the example file and add your OAuth credentials:

```bash
cp .env.example .env
```

Then edit `.env` and add credentials for the providers you want to support:

```env
# GitHub
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# GitLab
GITLAB_CLIENT_ID=your_gitlab_client_id_here
GITLAB_CLIENT_SECRET=your_gitlab_client_secret_here

# Bitbucket
BITBUCKET_CLIENT_ID=your_bitbucket_client_id_here
BITBUCKET_CLIENT_SECRET=your_bitbucket_client_secret_here

# Azure DevOps
AZURE_DEVOPS_CLIENT_ID=your_azure_devops_client_id_here
AZURE_DEVOPS_CLIENT_SECRET=your_azure_devops_client_secret_here

FRONTEND_URL=https://stackseek.io
```

### 6. Restart the Server
```bash
npm run dev
```

## Testing Authentication

### Manual Email/Password:
1. Go to `/register`
2. Fill out the form with valid email/password
3. Check your email for verification link
4. After verification, go to `/login` and sign in

### Google OAuth:
1. Go to `/login` or `/register`
2. Click "Continue with Google"
3. Authorize the application
4. Should redirect to dashboard

### Git Provider OAuth:
1. Set up OAuth app for your chosen provider (see setup sections above)
2. Configure environment variables
3. Go to `/login` or `/register`
4. Click "Continue with [Provider]"
5. Authorize the application
6. Should redirect to `/connect-repository`

## Backend Endpoints

The following authentication endpoints are now available:

### GitHub:
- `GET /api/auth/github` - Initiate GitHub OAuth flow
- `GET /api/auth/github/callback` - Handle GitHub OAuth callback
- `GET /api/github/repositories` - Get user's GitHub repositories (requires Bearer token)

### GitLab:
- `GET /api/auth/gitlab` - Initiate GitLab OAuth flow
- `GET /api/auth/gitlab/callback` - Handle GitLab OAuth callback
- `GET /api/gitlab/repositories` - Get user's GitLab repositories (requires Bearer token)

### Bitbucket:
- `GET /api/auth/bitbucket` - Initiate Bitbucket OAuth flow
- `GET /api/auth/bitbucket/callback` - Handle Bitbucket OAuth callback
- `GET /api/bitbucket/repositories` - Get user's Bitbucket repositories (requires Bearer token)

### Azure DevOps:
- `GET /api/auth/azure-devops` - Initiate Azure DevOps OAuth flow
- `GET /api/auth/azure-devops/callback` - Handle Azure DevOps OAuth callback
- `GET /api/azure-devops/repositories` - Get user's Azure DevOps repositories (requires Bearer token)

## Common Issues

### Firebase Errors:
- Make sure your Firebase project is properly configured
- Check that the domain is authorized in Firebase console
- Verify email verification is enabled

### Git Provider OAuth Errors:

#### GitHub:
- Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set
- Check that callback URL matches exactly: `https://stackseek.io/api/auth/github/callback`
- Verify the GitHub app is not suspended

#### GitLab:
- Ensure `GITLAB_CLIENT_ID` and `GITLAB_CLIENT_SECRET` are set
- Check that redirect URI matches exactly: `https://stackseek.io/api/auth/gitlab/callback`
- Verify scopes include `read_user` and `read_repository`

#### Bitbucket:
- Ensure `BITBUCKET_CLIENT_ID` and `BITBUCKET_CLIENT_SECRET` are set
- Check that callback URL matches exactly: `https://stackseek.io/api/auth/bitbucket/callback`
- Verify permissions include Account: Read and Repositories: Read

#### Azure DevOps:
- Ensure `AZURE_DEVOPS_CLIENT_ID` and `AZURE_DEVOPS_CLIENT_SECRET` are set
- Check that callback URL matches exactly: `https://stackseek.io/api/auth/azure-devops/callback`
- Verify scopes include Code (read) and Project and team (read)

### General:
- Make sure the development server is running on the correct port
- Check browser console for detailed error messages
- Verify all environment variables are loaded correctly
- Restart the server after changing environment variables
- If a provider button shows "not configured", check that the environment variables are set correctly
