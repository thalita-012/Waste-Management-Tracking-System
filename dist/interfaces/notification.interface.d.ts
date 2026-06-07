export interface Notification {
    id: number;
    userId: number;
    message: string;
    status: "READ" | "UNREAD";
    createAt: Date;
}
