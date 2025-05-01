import {
  Client,
  PrivateKey,
  AccountId,
  CustomFixedFee,
  TopicCreateTransaction,
  PublicKey
} from '@hashgraph/sdk';

import dotenv from 'dotenv';

dotenv.config();

async function main() {
  if (
    !process.env.AGENT_HEDERA_ACCOUNT_ID ||
    !process.env.AGENT_HEDERA_PRIVATE_KEY ||
    !process.env.AGENT_HEDERA_PUBLIC_KEY
  ) {
    throw new Error(
      'AGENT_HEDERA_ACCOUNT_ID | AGENT_HEDERA_PRIVATE_KEY | AGENT_HEDERA_PUBLIC_KEY is not set in the environment variables'
    );
  }

  console.log('Setting up custom fee configuration');


  const newClient = Client.forTestnet().setOperator(
    AccountId.fromString(process.env.AGENT_HEDERA_ACCOUNT_ID),
    PrivateKey.fromStringECDSA(process.env.AGENT_HEDERA_PRIVATE_KEY)
  );

  // Create topic to interact with the agent
  const customFee = new CustomFixedFee({
    feeCollectorAccountId: AccountId.fromString(process.env.AGENT_HEDERA_ACCOUNT_ID),
    amount: 10
  });

  const agentTopicCreateTx = new TopicCreateTransaction()
    .setCustomFees([customFee])
    .setFeeExemptKeys(
      [
        PublicKey.fromStringECDSA(process.env.AGENT_HEDERA_PUBLIC_KEY)
      ]
    );

  const executeAgentTopicCreateTx = await agentTopicCreateTx.execute(newClient)
  const agentTopicCreateReceipt = await executeAgentTopicCreateTx.getReceipt(newClient)
  const agentTopicId = agentTopicCreateReceipt.topicId

  console.log(`Agent topic created successfully with ID: ${agentTopicId}`)

  // Create topic to publish audit scores
  const auditsTopicCreateTx = new TopicCreateTransaction().setSubmitKey(
    PublicKey.fromStringECDSA(process.env.AGENT_HEDERA_PUBLIC_KEY)
  );

  const executeAuditsTopicCreateTx = await auditsTopicCreateTx.execute(newClient)
  const auditsTopicCreateReceipt = await executeAuditsTopicCreateTx.getReceipt(newClient)
  const auditsTopicId = auditsTopicCreateReceipt.topicId

  console.log(`Audits topic created succesfully with ID: ${auditsTopicId}`)
}

main()
  .then(() => {
    console.log('Topics created successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
