// types.ts
export interface Booking {
    id: string;
    roomNumber: string;
    guestId: string;
    amount: number;
    paymentMethod: string;
    status: string;
}

export interface ServiceRecord {
    id: string;
    guestId: string;
    amount: number;
    paymentMethod: string;
    status: string;
}

export interface Guest {
    GuestId: string;
    firstName: string;
    lastName: string;
}

export interface Room {
    roomNumber: string;
    status: string;
}

export interface Service {
    serviceId: string;
    ServiceName: string;
}
// types.ts
export interface Payment {
    id: number;
    amount: number;
    paymentMethod: string;
    StaffId: string;
    itemId: string;
}
