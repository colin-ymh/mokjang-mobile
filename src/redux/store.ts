import {configureStore} from '@reduxjs/toolkit';
import UserReducer from './reducers/user-reducer';
import AuthReducer from './reducers/auth-reducer';

const store = configureStore({
  reducer: {
    user: UserReducer,
    auth: AuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
