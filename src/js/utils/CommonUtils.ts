import { ApplicationConstants } from "../common/ApplicationConstants";

export class CommonUtils {

	public static isNullOrEmpty(input: any) {
		return (input === null || input === undefined || jQuery.isEmptyObject(input) || input.toString().length === 0 || input === "null");
	}

	public static getNewGuId(): string {
		var d: number = new Date().getTime();
		var guid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});

		return guid;
	}

	public static isObject(obj: any): boolean {
		return (!!obj) && (obj.constructor === Object);
	}

	public static pullFocusToElement(elementId): void {
		$('#' + elementId).focus();
	}

	public static angularInherits(ctor, superCtor): void {
		ctor.super_ = superCtor;
		if (superCtor) {
			ctor.prototype = Object.create(superCtor.prototype, {
				constructor: {
					value: ctor,
					enumerable: false
				}
			});
		}
	}

	public static hashCode(value): string {
		var hash = 0;
		if (value.length == 0)
			return hash.toString();
		for (var i = 0; i < value.length; i++) {
			var char = value.toString().charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash.toString();
	}

	public static getSessionStorageUserInfoKey(userAlias: string): string {
		return userAlias + "-userInfo";
	}

	public static getSessionStorageUserClaimsKey(userAlias: string): string {
		return "fxpUserClaims_" + userAlias;
	}

	public static getArrayLength(arrayCollection): number {
		return CommonUtils.isNullOrEmpty(arrayCollection) ? 0 : arrayCollection.length;
	}

	public static getIndexOfObject(source, compareKey, value): number {
		var index = -1;
		var length = source.length;
		for (let i = 0; i < length; i++) {
			if (source[i][compareKey] === value) {
				index = i;
				break;
			}
		}
		return index;
	}

	public static generateUPN(userInfo: any, fxpAppSettings: any): string {
		// getting user alias and removing partners~ from it if it is there.
		let UPN = userInfo.Alias;
		if (userInfo.Domain.toLowerCase() == "corpnet")
			// appending domain.
			UPN += fxpAppSettings.UPNCorpnet;
		else
			// removing partners~ from UPN if it is there and appending partner domain.
			UPN = UPN.substring(UPN.indexOf('~') + 1) + fxpAppSettings.UPNPartner;
		return UPN.toLowerCase();
	}

	public static stringFormat(str: string, ...params: string[]) {
		return str.replace(/{(\d+)}/g, function (match, number) {
			return typeof params[number] != 'undefined'
				? params[number]
				: match
				;
		});
	}

	public static getTenantURLSpecificPageTitle(str: string) {
		if (window.location.href.indexOf(ApplicationConstants.SalesTenantUrlString) > -1) {
			return str.replace(ApplicationConstants.ESTenanatUrlString, ApplicationConstants.SalesTenantUrlString);
		}
		return str;
	}

	public static jsonConcat(obj1: any, obj2: any) {
		for (var key in obj2) {
			obj1[key] = obj2[key];
		}
		return obj1;
	}
}