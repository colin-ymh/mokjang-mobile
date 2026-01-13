import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {BLANK, OAUTH_PROVIDER} from '../../constants/common';

type AuthState = {
  provider: OAUTH_PROVIDER | undefined;
  providerId: string;
};

const initialState: AuthState = {
  provider: undefined,
  providerId: BLANK,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProvider(state, action: PayloadAction<OAUTH_PROVIDER>) {
      state.provider = action.payload;
    },
    setProviderId(state, action: PayloadAction<string>) {
      state.providerId = action.payload;
    },
  },
});

export const {setProvider, setProviderId} = AuthSlice.actions;

export default AuthSlice.reducer;
