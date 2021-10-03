import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TyperingState {
  collection: { [key: string]: Typering };
  active: string | undefined;
  color: string;
  colorPicker: boolean;
}

const initialState: TyperingState = {
  collection: {},
  active: undefined,
  color: "#ABB8C3",
  colorPicker: false,
};

export const typeringSlice = createSlice({
  name: "typering",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<{ id: string; createdAt: number; x: number; y: number; color: string; text?: string }>) => {
      const { id, createdAt, x, y, color, text } = action.payload;
      state.collection[id] = { createdAt, x, y, color, text: text ? text : "" };
      state.active = id;
    },
    update: (state, action: PayloadAction<{ id: string; x?: number; y?: number; color?: string; text?: string }>) => {
      const { id, x, y, color, text } = action.payload;
      if (x) state.collection[id].x = x;
      if (y) state.collection[id].y = y;
      if (color) state.collection[id].color = color;
      if (text) state.collection[id].text = text;
    },
    load: (state, action: PayloadAction<{ action: string; typerings: { [key: string]: Typering } }>) => {
      state.collection = action.payload.typerings;
    },
    remove: (state, action: PayloadAction<{ action: string; id: string }>) => {
      const { id } = action.payload;
      delete state.collection[id];
      if (state.active === id) state.active = undefined;
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
  },
});

export const { add, update, load, remove, blur, setColor, setColorPicker } = typeringSlice.actions;

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

export default typeringSlice.reducer;
