# Google Indexing API Setup

This directory contains scripts for requesting Google to index non-indexed blog pages.

## Quick Start

1. **Follow Setup Guide**: Read `google-indexing-api-setup.md` for detailed instructions
2. **Install Dependencies**: `pip install -r requirements.txt`
3. **Get Credentials**: Download `service-account.json` from Google Cloud Console
4. **Run Script**: `python request-indexing.py`

## Files

- `google-indexing-api-setup.md` - Complete setup instructions
- `request-indexing.py` - Main indexing script
- `urls-to-index.txt` - List of 34 URLs to request indexing for
- `requirements.txt` - Python dependencies
- `service-account.json` - **YOUR CREDENTIALS (DO NOT COMMIT)**

## Security

The `service-account.json` file is automatically ignored by Git. Never commit credentials to version control.

## Support

- Google Indexing API Docs: https://developers.google.com/search/apis/indexing-api/v3/quickstart
- Search Console: https://search.google.com/search-console
