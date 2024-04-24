export interface Config {
    PINATA_API_KEY: string;
    PINATA_API_SECRET: string;
    PINATA_API_JWT: string;
    TABLELAND_PROVIDER: string;
    TABLELAND_PRIVATE_KEY: string;

    USER_ACCESS_CONTROL_CONTRACT_ADDRESS: string;
    FILE_STORAGE_CONTRACT_ADDRESS: string;

    TABLELAND_FACTORY: boolean;
}
