import { unipileClient } from "..";
import { UNIPILE_BASE_URL } from "..";

export class ProfileService {
    static async connectLinkedinAccount(
        uniqueIdentifier?: string,
        successRedirectUrl?: string,
        failureRedirectUrl?: string,
        notifyUrl?: string
    ) {
        const response = await unipileClient.account.createHostedAuthLink({
            type: "create",
            api_url: UNIPILE_BASE_URL,
            expiresOn: "2024-12-22T12:00:00.701Z",
            providers: ["LINKEDIN"],
            name: uniqueIdentifier || "",
            notify_url: notifyUrl || undefined,
            success_redirect_url: successRedirectUrl || undefined,
            failure_redirect_url: failureRedirectUrl || undefined,
        });
        return response as any;
    }

    static async getBasicUserProfile(accountId: string, linkedinIdentifier: string) {
        const response = await unipileClient.users.getProfile({
            account_id: accountId,
            identifier: linkedinIdentifier,
        });
        return response as any;
    }

    static async getCompleteUserProfile(accountId: string, linkedinIdentifier: string) {
        const response = await unipileClient.users.getProfile({
            account_id: accountId,
            identifier: linkedinIdentifier,
            linkedin_sections: "*",
        });
        return response as any;
    }

    static async getUserWorkExperience(accountId: string, linkedinIdentifier: string) {
        const response = await unipileClient.users.getProfile({
            account_id: accountId,
            identifier: linkedinIdentifier,
            linkedin_sections: "experience",
        });
        return response as any;
    }

    static async getUserEducation(accountId: string, linkedinIdentifier: string) {
        const response = await unipileClient.users.getProfile({
            account_id: accountId,
            identifier: linkedinIdentifier,
            linkedin_sections: "education",
        });
        return response;
    }

    static async getUserSkills(accountId: string, linkedinIdentifier: string) {
        const response = await unipileClient.users.getProfile({
            account_id: accountId,
            identifier: linkedinIdentifier,
            linkedin_sections: "skills",
        });
        return response as any;
    }
}
