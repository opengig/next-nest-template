import { UnipileClient } from "unipile-node-sdk";

export const UNIPILE_BASE_URL = process.env.NEXT_PUBLIC_UNIPILE_DNS_URL!;
export const UNIPILE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_UNIPILE_ACCESS_TOKEN!;

export const unipileClient = new UnipileClient(UNIPILE_BASE_URL, UNIPILE_ACCESS_TOKEN);
