# Google Indexing API Setup Guide

## Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Create Project" or select existing project
3. Name it: `narkins-builders-indexing`
4. Click "Create"

## Step 2: Enable Indexing API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Web Search Indexing API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Name: `indexing-service-account`
4. Role: Select "Owner" (for testing) or "Editor"
5. Click "Done"

## Step 4: Create JSON Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON"
5. Save the downloaded file as `service-account.json`
6. **IMPORTANT:** Move it to `D:\work\narkins-builders\scripts\service-account.json`

## Step 5: Grant Search Console Permissions

1. Open your `service-account.json` file
2. Copy the `client_email` value (looks like: xyz@project-id.iam.gserviceaccount.com)
3. Go to https://search.google.com/search-console
4. Select your property (narkinsbuilders.com)
5. Go to "Settings" > "Users and permissions"
6. Click "Add user"
7. Paste the service account email
8. Grant "Owner" permission
9. Click "Add"

## Step 6: Install Required Packages

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 requests
```

## Step 7: Run the Indexing Script

```bash
python scripts/request-indexing.py
```

## Security Notes

- ⚠️ Never commit `service-account.json` to Git
- ⚠️ Keep credentials secure
- ✅ Already added to .gitignore

## Troubleshooting

### Error: "Permission denied"
- Make sure the service account email is added to Search Console with Owner permissions
- Wait 5-10 minutes after adding for permissions to propagate

### Error: "API not enabled"
- Ensure "Web Search Indexing API" is enabled in Google Cloud Console

### Error: "Invalid credentials"
- Check that `service-account.json` is in the correct location
- Verify the JSON file is valid (not corrupted)
