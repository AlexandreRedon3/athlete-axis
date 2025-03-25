export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

export type Quote = {
  id: string;
  number: string;
  client : {
    id: string;
    name: string;
  }
  date: string;
  amount: number;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
};