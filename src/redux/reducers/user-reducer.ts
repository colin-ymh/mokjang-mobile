import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {User} from '../../models/user/user';
import {DEFAULT_USER} from '../../constants/default/default';

type UserState = {
  user: User;
};

const initialState: UserState = {
  user: DEFAULT_USER,
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const {setUser} = UserSlice.actions;

export default UserSlice.reducer;
