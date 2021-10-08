import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TyperingState {
  collection: { [key: string]: Typering };
  onHold: TyperingOnHold | undefined;
  active: TyperingOnHold | undefined;
  color: string;
  colorPicker: boolean;
  counter: number;
}

const initialState: TyperingState = {
  collection: {},
  onHold: undefined,
  active: undefined,
  color: localStorage.getItem("color") || "#ABB8C3",
  colorPicker: false,
  counter: 0,
};

export const typeringSlice = createSlice({
  name: "typering",
  initialState,
  reducers: {
    hold: (state, action: PayloadAction<TyperingOnHold | undefined>) => {
      state.onHold = action.payload;
    },
    add: (state, action: PayloadAction<TyperingOnHold | undefined>) => {
      if (action.payload) {
        const { id, ...typering } = action.payload;
        state.collection[id] = typering;
      } else if (state.onHold) {
        const { id, ...typering } = state.onHold;
        state.collection[id] = typering;
      }
    },
    update: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const { id, text } = action.payload;
      if (state.collection[id]) state.collection[id].text = text;
    },
    load: (state, action: PayloadAction<{ action: string; typerings: { [key: string]: Typering } }>) => {
      state.collection = action.payload.typerings;
    },
    remove: (state, action: PayloadAction<{ action: string; id: string }>) => {
      const { id } = action.payload;
      delete state.collection[id];
      if (state.active?.id === id) state.active = undefined;
    },
    select: (state, action: PayloadAction<TyperingOnHold>) => {
      state.active = action.payload;
    },
    blur: (state) => {
      state.active = undefined;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setColorPicker: (state, action: PayloadAction<boolean>) => {
      state.colorPicker = action.payload;
    },
    flush: (state) => {
      state.collection = {};
    },
    counter: (state, action: PayloadAction<{ action: string; value: number }>) => {
      const { value } = action.payload;
      state.counter = value;
    },
  },
});

export const { hold, add, update, load, remove, select, blur, setColor, setColorPicker, flush, counter } = typeringSlice.actions;

// Helpers
export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Definitions
export type Typering = {
  createdAt: number;
  x: number;
  y: number;
  text: string;
  color: string;
};

export interface TyperingOnHold extends Typering {
  id: string;
}

export default typeringSlice.reducer;
