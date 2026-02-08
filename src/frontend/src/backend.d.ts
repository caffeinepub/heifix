import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RepairTicket {
    id: bigint;
    customerName: string;
    contactInfo: string;
    issueDescription: string;
    technicianNotes?: string;
    createdAt: Time;
    createdBy: Principal;
    statusHistory: Array<StatusLog>;
    priceEstimate?: number;
    deviceBrand: string;
    currentStatus: TicketStatus;
    deviceModel: string;
}
export interface StatusLog {
    status: TicketStatus;
    notes?: string;
    timestamp: Time;
}
export type Time = bigint;
export enum TicketStatus {
    new_ = "new",
    closed = "closed",
    waitingForParts = "waitingForParts",
    inProgress = "inProgress",
    ready = "ready"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTicket(customerName: string, contactInfo: string, deviceBrand: string, deviceModel: string, issueDescription: string): Promise<bigint>;
    getAllTickets(): Promise<Array<RepairTicket>>;
    getCallerUserRole(): Promise<UserRole>;
    getMyTickets(): Promise<Array<RepairTicket>>;
    getTicketDetails(ticketId: bigint): Promise<RepairTicket>;
    isCallerAdmin(): Promise<boolean>;
    updateTicketStatus(ticketId: bigint, newStatus: TicketStatus, notes: string | null, priceEstimate: number | null): Promise<void>;
}
