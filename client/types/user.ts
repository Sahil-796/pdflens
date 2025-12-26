export interface UserDetails {
    plan: string;
    emailVerified: boolean;
    creditsLeft: number;
    providerId: string;
}

export interface CreditHistory {
    id: string;
    user_id: string;
    amount: number;
    reason: string;
    created_at: Date;
}

export type Subscription = {
    id: string;
    status: "active" | "canceled" | "incomplete" | "past_due";
    current_period_end: string;
    cancel_at_period_end: boolean;
    product: {
        name: string;
        prices: {
            price_amount: number;
            price_currency: string;
            recurring_interval: string;
        }[];
    };
    customer: {
        email: string;
    };
};

export type Invoice = {
    id: string;
    amount: number;
    currency: string;
    created_at: string;
    status: string;
};
