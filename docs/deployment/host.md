---
title: Hostname and Path Configuration
nav_order: 4
parent: Deployment
---
# Hostname and Path Configuration
{: .no_toc}

## Table of Contents
{: .no_toc .text-delta}

1. TOC
{:toc}
---
## Hostname Configuration
Set the `INFERNO_HOST` environment variable in `.env` to tell Inferno what its
host and scheme are. This allows Inferno to correctly construct things like
absolute redirect and launch urls for the SMART App Launch workflow.

## Base Path Configuration
If Inferno won't be hosted at the root of its host (e.g., you want to host
Inferno at `http://example.com/inferno` rather than at `http://example.com`):
- Set the `BASE_PATH` environment variable in `.env`
- In `nginx.conf`, change `location /` to `location /your_base_path`
