
import { Trend, CampaignIdea } from '../types';
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Tool Definitions for Intent Parsing ---
const tools: { functionDeclarations: FunctionDeclaration[] }[] = [{
    functionDeclarations: [
        {
            name: 'find_trends',
            description: 'Finds top trending hashtags and sounds on TikTok for affiliate marketing.',
        },
        {
            name: 'generate_campaign',
            description: 'Generates a viral TikTok video campaign idea for a specific niche.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    niche: {
                        type: Type.STRING,
                        description: 'The product category or niche for the campaign, e.g., "tech gadgets" or "fitness".',
                    },
                },
                required: ['niche'],
            },
        },
        {
            name: 'complex_query',
            description: 'Handles complex, open-ended questions that require deep analysis, strategic thinking, or creative brainstorming about marketing, trends, and business strategy.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    query: {
                        type: Type.STRING,
                        description: 'The user\'s complex question or prompt.',
                    },
                },
                required: ['query'],
            },
        },
    ]
}];

// --- Schemas for Structured Content Generation ---
const trendSchema = {
    type: Type.OBJECT,
    properties: {
      trends: {
        type: Type.ARRAY, description: 'A list of top 3 trending items.',
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING }, 
            sourceId: { type: Type.STRING },
            type: { type: Type.STRING }, 
            title: { type: Type.STRING },
            source: { type: Type.STRING },
            engagementVelocity: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            posts: { type: Type.NUMBER },
            growth: { type: Type.NUMBER, description: 'A fictional but realistic growth percentage, e.g., 124.' },
            difficulty: { type: Type.STRING, description: 'Competition difficulty: Easy, Med, or Hard.'},
          },
          required: ['id', 'sourceId', 'type', 'title', 'source', 'engagementVelocity', 'posts', 'growth', 'difficulty'],
        },
      },
    },
    required: ['trends'],
};

const campaignSchema = {
    type: Type.OBJECT,
    properties: {
        campaign: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING }, hook: { type: Type.STRING },
                scriptOutline: { type: Type.ARRAY, items: { type: Type.STRING } },
                cta: { type: Type.STRING },
            },
            required: ['title', 'hook', 'scriptOutline', 'cta'],
        }
    },
    required: ['campaign'],
};

// --- Service Functions ---

/**
 * Parses the user's command to determine the correct tool to use.
 */
export const parseIntent = async (command: string): Promise<{ action: string; params: any }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Parse the user's command and select the appropriate tool: "${command}"`,
            config: { tools },
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall) {
            return {
                action: functionCall.name,
                params: functionCall.args,
            };
        }
        return { action: 'unknown', params: {} };
    } catch (error) {
        console.error("Error parsing intent:", error);
        return { action: 'error', params: {} };
    }
};

/**
 * Generates data for the Trend Card widget.
 */
export const getTrendData = async (): Promise<{ text: string; widget: { type: 'TREND_CARD'; data: Trend[] } }> => {
    const prompt = `You are an expert TikTok trend analyst. Find the top 3 trending hashtags and sounds for affiliate marketing. Provide fictional but realistic data for engagement, post counts, growth percentage, and competition difficulty (Easy, Med, or Hard). IDs should be short and unique e.g. trend-1`;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: trendSchema },
    });
    const jsonResponse = JSON.parse(response.text?.trim() ?? '{}');
    return {
        text: 'I found 3 high-potential trends matching your query. Here are the details:',
        widget: { type: 'TREND_CARD', data: jsonResponse.trends },
    };
};

/**
 * Generates data for the Campaign Builder widget.
 */
export const getCampaignIdea = async (params: { niche: string }): Promise<{ text: string; widget: { type: 'CAMPAIGN_BUILDER'; data: CampaignIdea } }> => {
    const { niche } = params;
    const prompt = `You are a viral marketing expert. Generate a viral TikTok video campaign idea for the "${niche}" niche. Provide a catchy title, a strong hook, a 3-point script outline, and a clear call to action.`;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: campaignSchema },
    });
    const jsonResponse = JSON.parse(response.text?.trim() ?? '{}');
    const campaignData = { ...jsonResponse.campaign, id: `campaign-${Date.now()}` };
    return {
        text: `Here is a campaign idea for the ${niche} niche.`,
        widget: { type: 'CAMPAIGN_BUILDER', data: campaignData },
    };
};

/**
 * Generates a detailed response for complex queries using a more powerful model.
 */
export const getComplexResponse = async (params: { query: string }): Promise<{ text: string }> => {
    const { query } = params;
    const prompt = `You are a world-class marketing and business strategist. Provide a comprehensive, in-depth response to the following query: "${query}"`;
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    return { text: response.text ?? "I've analyzed your query, but I couldn't formulate a response. Please try rephrasing." };
};

/**
 * Generates a generic text response for unknown commands.
 */
export const getGenericResponse = async (command: string): Promise<{ text: string }> => {
    const prompt = `You are a helpful assistant for a TikTok marketing platform called TrendFlow AI. Keep your responses concise and helpful. Respond to the following user query: "${command}"`;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
    });
    return { text: response.text ?? "Sorry, I couldn't generate a response." };
};

/**
 * Optimizes a caption for better engagement.
 */
export const optimizeCaption = async (caption: string): Promise<string> => {
    try {
        const prompt = `You are a viral marketing expert specializing in TikTok captions. Optimize the following text to be more engaging and increase click-through rate. Return only the optimized text, nothing else, no quotes: "${caption}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text?.trim() ?? caption;
    } catch (error) {
        console.error("Error optimizing caption:", error);
        return caption; // Return original caption on error
    }
};