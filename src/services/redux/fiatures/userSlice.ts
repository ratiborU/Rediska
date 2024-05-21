import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store.ts';
import { TAuthor } from '../../types/types.tsx';


const initialState: TAuthor = {
  username: '',
  id: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action:  PayloadAction<TAuthor>) => {
      state.username = action.payload.username;
      state.id = action.payload.id;
    }
  }
})


export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;