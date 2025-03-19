export interface Item {
  serialNumber: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  // itemName: string;
}

export interface Invoice {
  invoiceNumber: string;
  address: string;
  date?: Date;
  items: Item[];
  subTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grossAmount: number;
}
