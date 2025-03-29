import axios from "axios";
import { UNIPILE_BASE_URL } from "..";

export class SearchService {
    static async searchPeopleByCompanyName(accountId: string, companyName: string) {
        const peopleUrl = `https://www.linkedin.com/search/results/people/?company=${companyName}&origin=FACETED_SEARCH&sid=wuQ`;
        const { data } = await axios.post(
            `${UNIPILE_BASE_URL}/api/v1/linkedin/search?account_id=${accountId}`,
            { url: peopleUrl },
            {
                headers: {
                    "X-API-KEY": process.env.UNIPILE_ACCESS_TOKEN,
                },
            }
        );
        return data?.items || [];
    }
    static async searchPeopleBySchoolName(accountId: string, schoolName: string) {
        const peopleUrl = `https://www.linkedin.com/search/results/people/?schoolFreetext=${schoolName}&origin=FACETED_SEARCH&sid=wuQ`;
        const { data } = await axios.post(
            `${UNIPILE_BASE_URL}/api/v1/linkedin/search?account_id=${accountId}`,
            { url: peopleUrl },
            { headers: { "X-API-KEY": process.env.UNIPILE_ACCESS_TOKEN } }
        );
        return data?.items || [];
    }
}
