export interface TransactionDTO {
    id: string;
    type: 'income' | 'outcome';
    name: string;
    value: number;
    amount: number;
    category: string;
    date: string;
    planId?: string;
    installmentNumber?: number;
    installmentTotal?: number;
    status?: 'pending' | 'paid';
}