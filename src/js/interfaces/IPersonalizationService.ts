export interface IPersonalizationService {
	getMasterLeftNavItems(): angular.IPromise<any>;
	getPersonalizedNavItems(userAlias: string, roleGroupId: string, userRoleId: string): angular.IPromise<any>;
	getPersistedPersonalization(key): any;
	persistUserPersonalization(key, value): void;
	removePersistedUserPersonalization(): void;
	getRoleGroupDetails(): angular.IPromise<any>;
	getRolePersonalizedNavItems(userRoleId: string, roleGroupId: string): angular.IPromise<any>;
	getRoleGroupPersonalizedList(roleGroupId: string): angular.IPromise<any>;
}