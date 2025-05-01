# Hedera Smart Contract Auditor

A specialized agent built on ElizaOS that audits smart contracts and publishes results to a Hedera Consensus Service (HCS) topic for public verification.

## Overview

This project extends ElizaOS with Hedera integration to create an autonomous agent that:

- Receives smart contract audit requests through a Hedera topic
- Performs comprehensive security and quality audits of smart contracts
- Publishes detailed audit reports and scores to a public Hedera topic
- Maintains a transparent and immutable record of all audits

## Key concepts

Hedera [HIP-991](https://hips.hedera.com/hip/hip-991) Permissionless revenue-generating Topic Ids for Topic Operators: To Interact with the agent, you need to send a message to the configured topic that requires a fee. This fee will be used to pay for the agent's services.

Hedera [HCS-10](https://hips.hedera.com/hip/hcs-10) Topic Operators: To interact with the agent, you need to be a topic operator.

## Key files

- [audit-contract.ts](./packages/plugin-hedera/src/actions/audit-contract/audit-contract.ts) - The main action that performs the audit
- [hedera-topics.ts](./packages/plugin-hedera/src/client/hedera-topics.ts) - The client that handles the Hedera topics communication

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
- Requires a fee to send the message, which will be the payment for the agent. In compliance with [HIP-991](https://hips.hedera.com/hip/hip-991)

### Public Topic

- Contains all audit results

## Acknowledgments

- [ElizaOS](https://github.com/elizaos/elizaos) - Base agent framework
- [Hedera](https://hedera.com) - Distributed ledger technology
- [Hashgraph SDK](https://github.com/hashgraph/hedera-sdk-js) - Hedera JavaScript SDK

## Hackathon Presentation

### Problem Statement

Smart contract security is critical in Web3, but current audit processes are:

- Expensive
- Time-consuming
- Not transparent
- Difficult to verify

### Our Solution

An autonomous agent that:

- Automates smart contract auditing
- Uses Hedera's Consensus Service for transparent communication
- Implements HIP-991 for sustainable revenue generation
- Provides immutable audit records on-chain

### Key Innovations

1. **Autonomous Auditing**

    - Self-operating agent that performs comprehensive audits
    - No human intervention required
    - Consistent and objective analysis

2. **Transparent Process**

    - All audit requests and results stored on Hedera
    - Public verification of audit results
    - Immutable audit history

3. **Sustainable Business Model**

    - Implements HIP-991 for revenue generation
    - Fair pricing through topic message fees
    - Self-sustaining operation

### Impact

- Democratizes smart contract auditing
- Reduces audit costs
- Increases transparency in Web3
- Creates new revenue opportunities for developers

### Future Vision

- Expand to multiple smart contract languages
- Implement machine learning for better vulnerability detection
- Create a reputation system for auditors
- Develop a web interface for easy interaction

### Demo

[Insert demo video or live demonstration details here]

### Team

[Insert team member names and roles here]

### Contact

[Insert contact information for follow-up questions]
