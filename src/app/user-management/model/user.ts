export interface User {
    id: number; // Unique identifier for the user
    firstName: string;
    lastName: string;
    metamaskAddress: string;
    address: Address | undefined;    
    addressId?: number; // Address Id used for joins
    employeeId?: number; // Employee Id used for joins
    sex: Sex;
    birthDay: string;
    notes?: string; // Additional notes about the user (optional)
    departmentName: string;
    officeName: string;
}

export interface Address {
    id: number;
    street: string; // Street address
    streetNo: number; // Street building number
    city: string; // City
    state: string; // State or region
    zipCode: string; // Postal code
    country: string; // Country
}

export enum Sex {
    male = 1,
    female = 2,
    other = 3,
}
// Function to map integer value to Sex enum
export function mapIntToSex(value: number): string | undefined {
    return Sex[value];
}