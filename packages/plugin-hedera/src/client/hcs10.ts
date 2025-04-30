import {
    type Client,
    composeContext,
    type Content,
    elizaLogger,
    generateMessageResponse,
    type IAgentRuntime,
    type Memory,
    messageCompletionFooter,
    ModelClass,
    stringToUuid,
    getEmbeddingZeroVector,
} from "@elizaos/core";
import { HederaProvider } from "../providers/client";
import type { HederaNetworkType } from "hedera-agent-kit/src/types";
import { TopicId, Timestamp } from "@hashgraph/sdk";

export const messageHandlerTemplate =
    // {{goals}}
    // "# Action Examples" is already included
    `{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{messageDirections}}

{{recentMessages}}

{{actions}}

# Instructions: Write the next message for {{agentName}}.
${messageCompletionFooter}`;

class HCS10Client {
    interval: NodeJS.Timeout;
    runtime: IAgentRuntime;
    lastMessageTimestamp: number;

    constructor(runtime: IAgentRuntime) {
        const hederaTopicId = runtime.getSetting("HEDERA_TOPIC_ID");
        if (!hederaTopicId) {
            elizaLogger.error("HEDERA_TOPIC_ID is not set");
            return;
        }
        const hederaNetworkType = runtime.getSetting(
            "HEDERA_NETWORK_TYPE",
        ) as HederaNetworkType;

        if (!hederaNetworkType) {
            elizaLogger.error("HEDERA_NETWORK_TYPE is not set");
            return;
        }
        const hederaAgentAccountId = runtime.getSetting("HEDERA_ACCOUNT_ID");
        if (!hederaAgentAccountId) {
            elizaLogger.error("HEDERA_ACCOUNT_ID is not set");
            return;
        }
        const hederaProvider = new HederaProvider(runtime).getHederaAgentKit();

        this.lastMessageTimestamp = Date.now() / 1000;
        elizaLogger.info(
            `HCS10 starting date ${this.lastMessageTimestamp} for topic ${hederaTopicId} on network ${hederaNetworkType}`,
        );

        this.runtime = runtime;
        this.interval = setInterval(
            async () => {
                try {
                    const newDate = Math.floor(Date.now() / 1000);
                    elizaLogger.debug(
                        `Getting hedera topic messages from ${this.lastMessageTimestamp} to ${newDate}`,
                    );
                    const messages = await hederaProvider.getTopicMessages(
                        TopicId.fromString(hederaTopicId),
                        hederaNetworkType,
                        this.lastMessageTimestamp,
                        newDate,
                    );

                    this.lastMessageTimestamp = newDate;

                    if (messages) {
                        elizaLogger.debug(
                            `New ${messages?.length} ${hederaTopicId} topic messages`,
                        );
                    }

                    for (const message of messages) {
                        if (message.payer_account_id === hederaAgentAccountId) {
                            elizaLogger.debug(
                                `Ignoring message from agent account ${message.payer_account_id}`,
                            );
                            continue;
                        }

                        const textMessage = message.message;
                        const userAccountId = message.payer_account_id;
                        const dateMessage = new Date(
                            message.consensus_timestamp,
                        );

                        if (!textMessage) return;

                        const messageId = stringToUuid(dateMessage.toString());

                        const content: Content = {
                            text: textMessage,
                            source: "hcs10",
                            inReplyTo: undefined,
                        };

                        const userMessage = {
                            content,
                            userId: stringToUuid(userAccountId),
                            roomId: stringToUuid(
                                `${hederaTopicId}-${userAccountId}`,
                            ),
                            agentId: runtime.agentId,
                        };

                        const memory: Memory = {
                            id: stringToUuid(
                                `${hederaTopicId}-${message.sequence_number}`,
                            ),
                            ...userMessage,
                            createdAt: Date.now(),
                        };

                        await runtime.messageManager.addEmbeddingToMemory(
                            memory,
                        );
                        await runtime.messageManager.createMemory(memory);

                        let state = await runtime.composeState(userMessage, {
                            agentName: runtime.character.name,
                        });

                        const context = composeContext({
                            state,
                            template: messageHandlerTemplate,
                        });

                        const response = await generateMessageResponse({
                            runtime,
                            context,
                            modelClass: ModelClass.LARGE,
                        });

                        if (!response) {
                            elizaLogger.error(
                                "No response from generateMessageResponse",
                            );
                            return;
                        }

                        // save response to memory
                        const responseMessage: Memory = {
                            id: stringToUuid(`${messageId}-${runtime.agentId}`),
                            ...userMessage,
                            content: response,
                            embedding: getEmbeddingZeroVector(),
                            createdAt: Date.now(),
                        };

                        await runtime.messageManager.createMemory(
                            responseMessage,
                        );

                        state = await runtime.updateRecentMessageState(state);

                        await runtime.processActions(
                            memory,
                            [responseMessage],
                            state,
                            async (newMessage) => {
                                elizaLogger.debug(
                                    `New message from action: ${JSON.stringify(newMessage)}`,
                                );
                                await hederaProvider.submitTopicMessage(
                                    TopicId.fromString(hederaTopicId),
                                    newMessage.text,
                                );
                                return [memory];
                            },
                        );

                        await runtime.evaluate(memory, state);

                        const action = runtime.actions.find(
                            (a) => a.name === response.action,
                        );
                        const shouldSuppressInitialMessage =
                            action?.suppressInitialMessage;

                        elizaLogger.debug(
                            `response: ${JSON.stringify(response)}`,
                        );

                        if (!shouldSuppressInitialMessage) {
                            // send response to hcs10 topic
                            await hederaProvider.submitTopicMessage(
                                TopicId.fromString(hederaTopicId),
                                response.text,
                            );
                        }
                    }
                } catch (error) {
                    elizaLogger.error(
                        `Error in HCS10 client: ${error}`,
                        error as Error,
                    );
                    return;
                }
            },
            10 * 1000, // 10 sec interval
        );
    }

    async stop() {
        elizaLogger.info("Stopping HCS10 client...");
        clearInterval(this.interval);
    }
}

export const HCS10ClientInterface: Client = {
    name: "hcs10",
    start: async (runtime: IAgentRuntime) => {
        elizaLogger.info("Starting HCS10 client...");

        const client = new HCS10Client(runtime);

        return client;
    },
};
