export interface TransactionDTO {
    id: string;
    type: 'income' | 'outcome';
    name: string;
    value: string;
    amount: string;
    category: string;
    date: string;
}