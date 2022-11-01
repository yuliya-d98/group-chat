import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppStateType } from '../redux/store';

// https://github.com/reduxjs/redux-toolkit/issues/587#issuecomment-1049488808
export type TypedDispatch = ThunkDispatch<AppStateType, unknown, AnyAction>;
export const useTypedDispatch = () => useDispatch<TypedDispatch>();
export const useTypedSelector: TypedUseSelectorHook<AppStateType> = useSelector;
