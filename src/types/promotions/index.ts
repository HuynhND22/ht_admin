export type FieldType = {
    name: string;
    limit: number;
    price: number;
    discount: number;
    startDate: string;
    endDate: string;
    statusId: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
    promotionDetails: PromotionDetail[]; // promotionDetails là một mảng các đối tượng PromotionDetail
};

export type PromotionDetail = {
    productSizeId: string;
    quantity: number;
    description: string;
};
