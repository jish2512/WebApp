export interface IUserClaims {
    firstName: string,
    lastName: string,
    upn: string,
    alias: string,
    aadObjectID: string,
    tenantClaims: any,
    defaultAppRole: string,
    Applications: any
}