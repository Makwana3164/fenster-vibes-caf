import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    status: BookingStatus;
    date: string;
    fullName: string;
    email: string;
    timestamp: bigint;
    specialRequest: string;
    phoneNumber: string;
    numberOfGuests: bigint;
    timeSlot: string;
}
export interface UserProfile {
    name: string;
}
export interface Review {
    name: string;
    reviewText: string;
    rating: bigint;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllReviews(): Promise<Array<Review>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBooking(booking: Booking): Promise<bigint>;
    submitReview(name: string, rating: bigint, reviewText: string): Promise<void>;
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
}
