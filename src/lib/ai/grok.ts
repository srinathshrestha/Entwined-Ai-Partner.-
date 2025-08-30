import OpenAI from "openai";
import { createOpenAI } from "@ai-sdk/openai";
import { AI_CIRCUIT_BREAKERS, retryWithBackoff } from "./circuit-breaker";

const grokClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY!,
  baseURL: "https://api.x.ai/v1",
});

// AI SDK compatible provider
export const grokProvider = createOpenAI({
  apiKey: process.env.XAI_API_KEY!,
  baseURL: "https://api.x.ai/v1",
});

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function generateResponse(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  } = {}
): Promise<AIResponse> {
  return await AI_CIRCUIT_BREAKERS.grok.execute(
    async () => {
      return await retryWithBackoff(async () => {
        console.log("Generating Grok response...");

        // Validate API key
        if (!process.env.XAI_API_KEY) {
          throw new Error("XAI_API_KEY not configured");
        }

        // Validate input
        if (!messages || messages.length === 0) {
          throw new Error("No messages provided for AI response");
        }

        const completion = await grokClient.chat.completions.create({
          model: "grok-3-mini",
          messages,
          temperature: options.temperature ?? 0.8,
          max_tokens: options.maxTokens ?? 1000,
          stream: options.stream ?? false,
        });

        // Enhanced debugging
        console.log("Grok API response:", {
          hasChoices: !!completion.choices,
          choicesLength: completion.choices?.length || 0,
          firstChoice: completion.choices?.[0]
            ? {
                hasMessage: !!completion.choices[0].message,
                hasContent: !!completion.choices[0].message?.content,
                contentLength:
                  completion.choices[0].message?.content?.length || 0,
                finishReason: completion.choices[0].finish_reason,
              }
            : null,
          usage: completion.usage,
        });

        // Validate response
        if (!completion.choices || completion.choices.length === 0) {
          throw new Error("No choices returned from Grok API");
        }

        const content = completion.choices[0]?.message?.content;
        const finishReason = completion.choices[0].finish_reason;

        if (!content || content.trim().length === 0) {
          const errorDetails = {
            hasContent: !!content,
            contentLength: content?.length || 0,
            contentPreview: content?.substring(0, 50) || "null",
            finishReason,
            model: "grok-3-mini",
            messageCount: messages.length,
          };

          // Special handling for token limit issues
          if (finishReason === "length") {
            console.warn(
              "🚫 Grok hit token limit during reasoning phase - reducing prompt complexity"
            );
            throw new Error(
              "Token limit exceeded during reasoning - prompt too complex"
            );
          }

          console.error("Empty/invalid content from Grok:", errorDetails);
          throw new Error(
            `Empty content returned from Grok API - Details: ${JSON.stringify(
              errorDetails
            )}`
          );
        }

        console.log(`Grok response generated: ${content.length} characters`);

        return {
          content,
          usage: {
            promptTokens: completion.usage?.prompt_tokens ?? 0,
            completionTokens: completion.usage?.completion_tokens ?? 0,
            totalTokens: completion.usage?.total_tokens ?? 0,
          },
        };
      }, 3); // Retry up to 3 times with exponential backoff
    },
    // Fallback function for when circuit breaker is open
    async () => {
      console.warn("Grok service unavailable - using fallback response");
      return {
        content:
          "I'm experiencing some technical difficulties right now. Please try again in a moment, and I'll be back to help you! 💙",
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    }
  );
}

export async function generateStreamResponse(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  return await AI_CIRCUIT_BREAKERS.grok.execute(
    async () => {
      return await retryWithBackoff(async () => {
        console.log("Generating Grok stream response...");

        // Validate API key
        if (!process.env.XAI_API_KEY) {
          throw new Error("XAI_API_KEY not configured");
        }

        // Validate input
        if (!messages || messages.length === 0) {
          throw new Error("No messages provided for AI stream");
        }

        const stream = await grokClient.chat.completions.create({
          model: "grok-3-mini",
          messages,
          temperature: options.temperature ?? 0.8,
          max_tokens: options.maxTokens ?? 1000,
          stream: true,
        });

        if (!stream) {
          throw new Error("Failed to create stream from Grok API");
        }

        console.log("Grok stream created successfully");
        return stream;
      }, 2); // Fewer retries for streaming (it's more time-sensitive)
    },
    // Fallback for streaming is more complex - we'll create a simple response stream
    async () => {
      console.warn("Grok streaming unavailable - using fallback");
      const fallbackContent =
        "I'm experiencing some technical difficulties right now. Please try again in a moment! 💙";

      // Create a mock stream-like response
      const mockStream = {
        async *[Symbol.asyncIterator]() {
          const words = fallbackContent.split(" ");
          for (const word of words) {
            yield {
              choices: [
                {
                  delta: { content: word + " " },
                },
              ],
            };
            // Small delay to simulate streaming
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        },
      };

      return mockStream as AsyncIterable<{
        choices: { delta: { content: string } }[];
      }>;
    }
  );
}