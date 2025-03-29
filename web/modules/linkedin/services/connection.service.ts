import { ProfileService } from ".";
import { unipileClient } from "..";

export class ConnectionService {
    static async sendConnectionRequest(accountId: string, linkedinIdentifier: string) {
        const profile: any = await ProfileService.getBasicUserProfile(accountId, linkedinIdentifier);

        const providerId = profile.provider_id;
        const response = await unipileClient.users.sendInvitation({
            account_id: accountId,
            provider_id: providerId,
        });
        return response as any;
    }

    static async getConnectionStatus(accountId: string, linkedinIdentifier: string) {
        const resp: any = await unipileClient.users.getProfile({
            account_id: accountId,
            identifier: linkedinIdentifier,
        });
        const networkDistance = resp.network_distance as string;
        return networkDistance as any;
    }

    static async withdrawConnectionRequest(accountId: string, invitationId: string) {
        const response = await unipileClient.users.cancelInvitationSent({
            account_id: accountId,
            invitation_id: invitationId,
        });
        return response as any;
    }
}
