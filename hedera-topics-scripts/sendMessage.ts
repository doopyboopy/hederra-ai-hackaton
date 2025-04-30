import {
  Client,
  TopicMessageSubmitTransaction,
  TopicId,
  PrivateKey,
  AccountId
} from '@hashgraph/sdk';

import dotenv from 'dotenv';

dotenv.config();

const message = () => {
  return `
  Audit this contract https://gist.githubusercontent.com/santgr11/ba3c36d841d5fc0982f925589b5e148e/raw/adede641c055435a21fc1d71c8adf5a0e6fd437b/counter.sol
`.trim();
};

async function main() {
  if (
    !process.env.TOPIC_ID ||
    !process.env.USER_HEDERA_PRIVATE_KEY ||
    !process.env.USER_HEDERA_ACCOUNT_ID
  ) {
    throw new Error(
      'TOPIC_ID | USER_HEDERA_PRIVATE_KEY | USER_HEDERA_ACCOUNT_ID is not set in the environment variables'
    );
  }

  console.log('Setting up transaction');
  const submitMessageTx = new TopicMessageSubmitTransaction()
    .setTopicId(TopicId.fromString(process.env.TOPIC_ID))
    .setMessage(message());

  console.log('Creating client');
  const newClient = Client.forTestnet().setOperator(
    AccountId.fromString(process.env.USER_HEDERA_ACCOUNT_ID),
    PrivateKey.fromStringECDSA(process.env.USER_HEDERA_PRIVATE_KEY)
  );
  console.log('Executing tx...');
  const executeSubmitMessageTx = await submitMessageTx.execute(newClient);
  console.log('Waiting for receipt...');
  const submitMessageReceipt = await executeSubmitMessageTx.getReceipt(
    newClient
  );
  console.log(`Message "${message()}" submitted successfully to topic`);
  console.log(`Transaction status: ${submitMessageReceipt.status}`);
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
