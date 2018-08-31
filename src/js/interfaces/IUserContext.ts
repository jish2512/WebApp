import { IUserInfo } from "./IUserInfo";
import { IUserClaims } from "./IUserClaims";

export interface IUserContext{
    userInfo : IUserInfo;
    userClaims: IUserClaims;
}