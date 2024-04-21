export interface Audit {
    id: string; // Unique identifier for any record
    initiatorGuid: string; // GUID of user who initiated the transaction
    initDate: Date;
    
    
}