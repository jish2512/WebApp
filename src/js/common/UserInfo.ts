
export class HomeLocation {
	HomeCountry: string;
	HomeCountryName: string;
	HomeState: string;
	HomeCity: string;
	HomeLocLongitude: string;
	HomeLocLatitude: string;
}

export class WorkLocation {
	WorkCountryCode: string;
	WorkCountry: string;
	WorkState: string;
	WorkCity: string;
	WorkLocLatitude: string;
	WorkLocLogitude: string;
}

export class UserInfo {
	private firstName: string;
	private lastName: string;
	private middleName: string;
	private fullName: string;
	private displayName: string;
	private businessDomain: string;
	private reportsTo: string;
	private reportsToDisplayName: string;
	private businessRole: string;
	private standardTitle: string;
	private email: string;
	private resourceImage: string;
	private businessRoleId: number;
	private reportsToFullName: string;
	private alias: string;
	private preferredFirstName: string;
	private seniority: string;
	private businessRoleDisplayName: string;
	private roleGroupId: number;
	private roleGroupName: string;
	private domain: string;
	private personnelNumber: number;
	private primaryTool: string;
	private costCenterCode: string;
	private hiringDate: any;
	private terminationDate: any;
	private serviceJobTitle: string;
	private resourceType: string;
	private alignmentType: string;
	private companyCode: number;
	private subAreaCode: number;
	private countryCode: any;
	private homeLocationNotFoundInd: boolean;
	private timeZoneId: number;
	private standardTimeZone: string;
	private resourceStatus: string;
	private resourceCategory: string;
	private resumeUrl: any;
	private functionHierarchyCode: string;

	constructor() {
	}
	get Alias(): string {
		return this.alias;
	}
	set Alias(value: string) {
		this.alias = value;
	}
	get FirstName(): string {
		return this.firstName;
	}
	set FirstName(value: string) {
		this.firstName = value;
	}
	get LastName(): string {
		return this.lastName;
	}
	set LastName(value: string) {
		this.lastName = value;
	}
	get MiddleName(): string {
		return this.middleName;
	}
	set MiddleName(value: string) {
		this.middleName = value;
	}
	get FullName(): string {
		return this.fullName;
	}
	set FullName(value: string) {
		this.fullName = value;
	}
	get DisplayName(): string {
		return this.displayName;
	}
	set DisplayName(value: string) {
		this.displayName = value;
	}
	get BusinessDomain(): string {
		return this.businessDomain;
	}
	set BusinessDomain(value: string) {
		this.businessDomain = value;
	}
	get ReportsTo(): string {
		return this.reportsTo;
	}
	set ReportsTo(value: string) {
		this.reportsTo = value;
	}
	get ReportsToDisplayName(): string {
		return this.reportsToDisplayName;
	}
	set ReportsToDisplayName(value: string) {
		this.reportsToDisplayName = value;
	}
	get BusinessRoleId(): number {
		return this.businessRoleId;
	}
	set BusinessRoleId(value: number) {
		this.businessRoleId = value;
	}
	get Seniority(): string {
		return this.seniority;
	}
	set Seniority(value: string) {
		this.seniority = value;
	}
	get BusinessRole(): string {
		return this.businessRole;
	}
	set BusinessRole(value: string) {
		this.businessRole = value;
	}
	get StandardTitle(): string {
		return this.standardTitle;
	}
	set StandardTitle(value: string) {
		this.standardTitle = value;
	}
	get Email(): string {
		return this.email;
	}
	set Email(value: string) {
		this.email = value;
	}
	get ResourceImage(): string {
		return this.resourceImage;
	}
	set ResourceImage(resourceImage: string) {
		this.resourceImage = resourceImage;
	}
	get ReportsToFullName(): string {
		return this.reportsToFullName;
	}
	set ReportsToFullName(reportsToFullName: string) {
		this.reportsToFullName = reportsToFullName;
	}
	get PreferredFirstName(): string {
		return this.preferredFirstName;
	}
	set PreferredFirstName(value: string) {
		this.preferredFirstName = value;
	}
	get BusinessRoleDisplayName(): string {
		return this.businessRoleDisplayName;
	}
	set BusinessRoleDisplayName(value: string) {
		this.businessRoleDisplayName = value;
	}
	get RoleGroupId(): number {
		return this.roleGroupId;
	}
	set RoleGroupId(value: number) {
		this.roleGroupId = value;
	}
	get RoleGroupName(): string {
		return this.roleGroupName;
	}
	set RoleGroupName(value: string) {
		this.roleGroupName = value;
	}
	get Domain(): string {
		return this.domain;
	}
	set Domain(value: string) {
		this.domain = value;
	}
	get PersonnelNumber(): number {
		return this.personnelNumber;
	}
	set PersonnelNumber(value: number) {
		this.personnelNumber = value;
	}
	get PrimaryTool(): string {
		return this.primaryTool;
	}
	set PrimaryTool(value: string) {
		this.primaryTool = value;
	}
	get CostCenterCode(): string {
		return this.costCenterCode;
	}
	set CostCenterCode(value: string) {
		this.costCenterCode = value;
	}
	get HiringDate(): any {
		return this.hiringDate;
	}
	set HiringDate(value: any) {
		this.hiringDate = value;
	}
	get TerminationDate(): any {
		return this.terminationDate;
	}
	set TerminationDate(value: any) {
		this.terminationDate = value;
	}
	get ServiceJobTitle(): string {
		return this.serviceJobTitle;
	}
	set ServiceJobTitle(value: string) {
		this.serviceJobTitle = value;
	}
	get ResourceType(): string {
		return this.resourceType;
	}
	set ResourceType(value: string) {
		this.resourceType = value;
	}
	get AlignmentType(): string {
		return this.alignmentType;
	}
	set AlignmentType(value: string) {
		this.alignmentType = value;
	}
	get CompanyCode(): number {
		return this.companyCode;
	}
	set CompanyCode(value: number) {
		this.companyCode = value;
	}
	get SubAreaCode(): number {
		return this.subAreaCode;
	}
	set SubAreaCode(value: number) {
		this.subAreaCode = value;
	}
	get CountryCode(): any {
		return this.countryCode;
	}
	set CountryCode(value: any) {
		this.countryCode = value;
	}
	get HomeLocationNotFoundInd(): boolean {
		return this.homeLocationNotFoundInd;
	}
	set HomeLocationNotFoundInd(value: boolean) {
		this.homeLocationNotFoundInd = value;
	}
	get TimeZoneId(): number {
		return this.timeZoneId;
	}
	set TimeZoneId(value: number) {
		this.timeZoneId = value;
	}
	get StandardTimeZone(): string {
		return this.standardTimeZone;
	}
	set StandardTimeZone(value: string) {
		this.standardTimeZone = value;
	}
	get ResourceStatus(): string {
		return this.resourceStatus;
	}
	set ResourceStatus(value: string) {
		this.resourceStatus = value;
	}
	get ResourceCategory(): string {
		return this.resourceCategory;
	}
	set ResourceCategory(value: string) {
		this.resourceCategory = value;
	}
	get ResumeUrl(): any {
		return this.resumeUrl;
	}
	set ResumeUrl(value: any) {
		this.resumeUrl = value;
	}
	get FunctionHierarchyCode(): string {
		return this.functionHierarchyCode;
	}
	set FunctionHierarchyCode(value: string) {
		this.functionHierarchyCode = value;
	}
	HomeLocation: HomeLocation;
	WorkLocation: WorkLocation;
	Weekdays: string[];
}