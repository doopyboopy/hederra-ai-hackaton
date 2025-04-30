# Hedera Smart Contract Auditor

A specialized agent built on ElizaOS that audits smart contracts and publishes results to a Hedera Consensus Service (HCS) topic for public verification.

## Overview

This project extends ElizaOS with Hedera integration to create an autonomous agent that:

- Receives smart contract audit requests through a Hedera topic
- Performs comprehensive security and quality audits of smart contracts
- Publishes detailed audit reports and scores to a public Hedera topic
- Maintains a transparent and immutable record of all audits

## Features

- **Smart Contract Analysis**: Deep analysis of Solidity smart contracts for security vulnerabilities and best practices
- **Transparent Auditing**: All audit results are published to a public Hedera topic for verification
- **Automated Scoring**: Comprehensive scoring system for smart contract quality and security
- **Hedera Integration**: Built on Hedera's Consensus Service for reliable and transparent communication
- **Real-time Updates**: Immediate publication of audit results to the public topic

## Architecture

The system consists of several key components:

1. **ElizaOS Core**: Base agent framework
2. **Hedera Plugin**: Handles all Hedera network interactions
3. **Smart Contract Analyzer**: Performs contract analysis and scoring
4. **Topic Management**: Manages HCS topics for request/response communication
5. **Audit Publisher**: Publishes results to public topic

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Hedera Testnet/Previewnet account
- WSL2 if using Windows

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your Hedera credentials and configuration.

3. Build the project:

```bash
pnpm run build
```

## Configuration

Required environment variables:

```
HEDERA_PRIVATE_KEY=your_private_key
HEDERA_ACCOUNT_ID=your_account_id
HEDERA_NETWORK_TYPE=testnet # or previewnet
HEDERA_KEY_TYPE=ED25519 # or ECDSA
```

## Usage

1. Start the agent:

```bash
pnpm start
```

It will use the [default hedera character](./characters/hedera.character.json).

2. Interact with the agent using the web client or sending messages to the configured topic.

## Audit Process

1. Smart contract is submitted to the audit request topic
2. Agent receives the request and begins analysis
3. Analysis includes:
    - Security vulnerabilities
    - Code quality
    - Gas optimization
    - Best practices compliance
4. Results are published in the same topic the audit was asked for.
5. The score is also published separatedly in a public topic linking the code.

## Topic Structure

### Request Topic

- Used to submit contracts for audit

### Public Topic

- Contains all audit results

## Acknowledgments

- [ElizaOS](https://github.com/elizaos/elizaos) - Base agent framework
- [Hedera](https://hedera.com) - Distributed ledger technology
- [Hashgraph SDK](https://github.com/hashgraph/hedera-sdk-js) - Hedera JavaScript SDK
