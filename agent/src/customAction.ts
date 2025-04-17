import {
  ActionExample,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  ModelClass,
  State,
  generateText,
  type Action
} from "@elizaos/core";

const getAuditSummaryPrompt = (contract: string) => {
  return `
  You are a specialist in smart contracts, specialiced in security and solidity.
  Audit the following smart contract and find any possible vulnerability.
  The answer must be conscise with a brief exaplanation.

  If the given smart contract is not in solidity or is not valid answer saying its not valid and the reason.


  Smart contract: \`\`\`${contract}\`\`\`

  Answer format:
  - A list of up to 5 most important possible vulnerabilities in the contract with a brief explanation on how to solve it.
  - A short final summary of the contract audit.
  - Score from 1 to 100 of the smart contract code, where security scores 0-50, code quality and good practices 0-25, and gas efficiency 0-25. ie: score: 85
`;
}

export const auditContractAction: Action = {
  name: "AUDIT_CONTRACT",
  similes: [
    "CHECK_CONTRACT",
    "INSPECT_CONTRACT"
  ],
  description: "Audits an smart contract",
  validate: async (runtime: IAgentRuntime, memory: Memory, state: State) => {
    return true;
  },
  handler: async (runtime: IAgentRuntime, memory: Memory, state?: State, options?, callback?: HandlerCallback) => {
    if (callback) {
      const audit = await generateText({
        runtime,
        context: getAuditSummaryPrompt(memory.content.text),
        modelClass: ModelClass.SMALL
      })


      callback({
        text: audit
      }, [])
    }
  },
  examples: [[
    {
      user: "{{user1}}",
      content: {
        text: "Audit this smart contract: {{solidity smart contract code}}",
        action: "AUDIT_CONTRACT"
      }
    },
    {
      user: "{{agentName}}",
      content: {
        text: "Auditing contract",
        action: "AUDIT_CONTRACT"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Audit this contract: {{solidity smart contract code}}",
        action: "AUDIT_CONTRACT"
      }
    },
    {
      user: "{{agentName}}",
      content: {
        text: "Auditing contract",
        action: "AUDIT_CONTRACT"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What do you think of this contract: {{solidity smart contract code}}",
        action: "AUDIT_CONTRACT"
      }
    },
    {
      user: "{{agentName}}",
      content: {
        text: "Auditing contract",
        action: "AUDIT_CONTRACT"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Review this contract: {{solidity smart contract code}}",
        action: "AUDIT_CONTRACT"
      }
    },
    {
      user: "{{agentName}}",
      content: {
        text: "Auditing contract",
        action: "AUDIT_CONTRACT"
      }
    }
  ]]
}

export const auditHederaDeployedContractAcion: Action = {
  name: "AUDIT_HEDERA_CONTRACT",
  description: "Audits an smart contract deployed in the Hedera blockchain.",
  similes: [
    "REVIEW_HEDERA_CONTRACT",
    "INSPECT_HEDERA_CONTRACT"
  ],
  validate: async (runtime: IAgentRuntime) => { return true },
  handler: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    _callback?: HandlerCallback
  ) => { },
  examples: []

}
