#!/usr/bin/env python3
"""
Google Indexing API - Batch URL Indexing Request Script
Requests indexing for non-indexed blog pages on narkinsbuilders.com
"""

import os
import json
import time
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configuration
SCOPES = ["https://www.googleapis.com/auth/indexing"]
SERVICE_ACCOUNT_FILE = Path(__file__).parent / "service-account.json"
URLS_FILE = Path(__file__).parent / "urls-to-index.txt"

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def load_credentials():
    """Load service account credentials from JSON file"""
    if not SERVICE_ACCOUNT_FILE.exists():
        print(f"{Colors.RED}[ERROR] service-account.json not found!{Colors.RESET}")
        print(f"{Colors.YELLOW}Please follow the setup guide in google-indexing-api-setup.md{Colors.RESET}")
        exit(1)

    try:
        credentials = service_account.Credentials.from_service_account_file(
            str(SERVICE_ACCOUNT_FILE), scopes=SCOPES
        )
        print(f"{Colors.GREEN}[OK] Credentials loaded successfully{Colors.RESET}")
        return credentials
    except Exception as e:
        print(f"{Colors.RED}[ERROR] Loading credentials: {e}{Colors.RESET}")
        exit(1)

def load_urls():
    """Load URLs to index from text file"""
    if not URLS_FILE.exists():
        print(f"{Colors.RED}[ERROR] urls-to-index.txt not found!{Colors.RESET}")
        exit(1)

    with open(URLS_FILE, 'r', encoding='utf-8') as f:
        urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]

    print(f"{Colors.BLUE}Loaded {len(urls)} URLs to index{Colors.RESET}")
    return urls

def request_indexing(url, service):
    """Request indexing for a single URL"""
    body = {
        "url": url,
        "type": "URL_UPDATED"
    }

    try:
        response = service.urlNotifications().publish(body=body).execute()
        return True, response
    except HttpError as e:
        error_details = json.loads(e.content.decode('utf-8'))
        return False, error_details

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Google Indexing API - Batch URL Indexing Request{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")

    # Load credentials
    credentials = load_credentials()

    # Build API service
    try:
        service = build('indexing', 'v3', credentials=credentials)
        print(f"{Colors.GREEN}[OK] API service initialized{Colors.RESET}\n")
    except Exception as e:
        print(f"{Colors.RED}[ERROR] Failed to initialize API service: {e}{Colors.RESET}")
        exit(1)

    # Load URLs
    urls = load_urls()

    # Process each URL
    successful = 0
    failed = 0

    print(f"{Colors.BLUE}Starting indexing requests...{Colors.RESET}\n")

    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] Processing: {url[:80]}...")

        success, response = request_indexing(url, service)

        if success:
            successful += 1
            print(f"{Colors.GREEN}  [OK] Success{Colors.RESET}")
        else:
            failed += 1
            error_msg = response.get('error', {}).get('message', 'Unknown error')
            print(f"{Colors.RED}  [FAIL] {error_msg}{Colors.RESET}")

        # Rate limiting: Google recommends 200 requests per minute max
        # Sleep for 0.3 seconds between requests (200/min = ~3.3/sec)
        if i < len(urls):
            time.sleep(0.3)

    # Summary
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}Summary{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.GREEN}Successful: {successful}{Colors.RESET}")
    print(f"{Colors.RED}Failed: {failed}{Colors.RESET}")
    print(f"{Colors.BLUE}Total: {len(urls)}{Colors.RESET}\n")

    if successful > 0:
        print(f"{Colors.YELLOW}Note: Indexing typically takes 24-48 hours{Colors.RESET}")
        print(f"{Colors.YELLOW}Check status in Google Search Console{Colors.RESET}\n")

if __name__ == "__main__":
    main()
