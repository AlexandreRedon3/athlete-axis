export type StripeInvoice = {
    id: string;
    amount: number;
    date: string;
    status: string;
    pdfUrl: string;
    number: string;
}