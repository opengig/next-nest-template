import { ProfileService } from ".";
import { unipileClient } from "..";

export class MessagingService {
    static async sendSingleMessage(accountId: string, linkedinIdentifier: string, message: string) {
        const profile: any = await ProfileService.getBasicUserProfile(accountId, linkedinIdentifier);

        const attendeeId = profile.provider_id;
        const response = await unipileClient.messaging.startNewChat({
            attendees_ids: [attendeeId],
            text: message,
            account_id: accountId,
        });
        return response as any;
    }

    static async sendBulkMessage(accountId: string, linkedinIdentifiers: string[], message: string) {
        const attendeesIds = await Promise.all(
            linkedinIdentifiers.map(async (linkedinIdentifier) => {
                const profile: any = await ProfileService.getBasicUserProfile(accountId, linkedinIdentifier);
                return profile.provider_id;
            })
        );

        const response = await unipileClient.messaging.startNewChat({
            attendees_ids: attendeesIds,
            text: message,
            account_id: accountId,
        });
        return response as any;
    }
}
