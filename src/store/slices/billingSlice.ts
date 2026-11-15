import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PaymentCard {
  id: string;
  brand: string;
  /** Só os 4 últimos dígitos: o número completo e o CVV nunca são guardados. */
  last4: string;
  expires: string;
  holder: string;
  primary: boolean;
}

interface BillingState {
  cards: PaymentCard[];
}

const initialState: BillingState = {
  cards: [
    { id: "card-7852", brand: "Mastercard", last4: "7852", expires: "08/28", holder: "FINOVA DEMO LTDA", primary: true },
    { id: "card-3401", brand: "Visa", last4: "3401", expires: "03/27", holder: "FINOVA DEMO LTDA", primary: false },
  ],
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    addCard(state, action: PayloadAction<PaymentCard>) {
      if (action.payload.primary) state.cards.forEach((card) => (card.primary = false));
      state.cards.push(action.payload);
    },
  },
});

export const { addCard } = billingSlice.actions;
export default billingSlice.reducer;
