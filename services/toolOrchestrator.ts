
import { CampaignIdea, Trend } from '../types';
import * as geminiService from './geminiService';

type CommandResult = {
    text: string;
    widget?: { type: 'TREND_CARD', data: Trend[] } | { type: 'CAMPAIGN_BUILDER', data: CampaignIdea };
    thinking?: boolean;
};

export const executeCommand = async (command: string): Promise<CommandResult> => {
    const intent = await geminiService.parseIntent(command);

    try {
        switch (intent.action) {
            case 'find_trends':
                return await geminiService.getTrendData();

            case 'generate_campaign':
                if (!intent.params.niche) {
                    return { text: "Please specify a niche for the campaign, for example: 'generate a campaign for fitness'." };
                }
                return await geminiService.getCampaignIdea(intent.params);

            case 'complex_query':
                const query = intent.params.query || command;
                const result = await geminiService.getComplexResponse({ query });
                return { ...result, thinking: true };

            case 'unknown':
                return await geminiService.getGenericResponse(command);

            case 'error':
                 return { text: "Sorry, I had trouble understanding that. Could you please rephrase?" };

            default:
                return await geminiService.getGenericResponse(command);
        }
    } catch (error) {
        console.error(`Error executing command for intent "${intent.action}":`, error);
        return { text: "Sorry, I encountered an error while processing your request. Please try again." };
    }
};