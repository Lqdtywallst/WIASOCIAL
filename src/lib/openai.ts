import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export function isOpenAIConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY ?? "";
  return key !== "" && key !== "your_openai_api_key";
}
