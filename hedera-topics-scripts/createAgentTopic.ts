import {
  Client,
  PrivateKey,
  AccountId,
  CustomFixedFee,
  TopicCreateTransaction
} from '@hashgraph/sdk';

import dotenv from 'dotenv';

dotenv.config();

async function main() {
  if (
    !process.env.AGENT_HEDERA_ACCOUNT_ID ||
    !process.env.AGENT_HEDERA_PRIVATE_KEY
  ) {
    throw new Error(
      'AGENT_HEDERA_ACCOUNT_ID | AGENT_HEDERA_PRIVATE_KEY is not set in the environment variables'
    );
  }

  console.log('Setting up custom fee configuration');


  const newClient = Client.forTestnet().setOperator(
    AccountId.fromString(process.env.AGENT_HEDERA_ACCOUNT_ID),
    PrivateKey.fromStringECDSA(process.env.AGENT_HEDERA_PRIVATE_KEY)
  );

  const customFee = new CustomFixedFee({
    feeCollectorAccountId: AccountId.fromString(process.env.AGENT_HEDERA_ACCOUNT_ID),
    amount: 10
  });

  const topicCreateTx = new TopicCreateTransaction().setCustomFees([customFee]);

  const executeTopicCreateTx = await topicCreateTx.execute(newClient)
  const topicCreateReceipt = await executeTopicCreateTx.getReceipt(newClient)
  const topicId = topicCreateReceipt.topicId

  console.log(`Topic created successfully with ID: ${topicId}`)
}

main()
  .then(() => {
    console.log('Message submitted successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
