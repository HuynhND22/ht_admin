export type FieldType = {
    tableId: string;
    userId: number;
    statusId: number;
    payment: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
    description?:string;
    orderDetails: orderDetail[];

};
export type orderDetail = {
quantity:number;
price:number;
  discount:number;}