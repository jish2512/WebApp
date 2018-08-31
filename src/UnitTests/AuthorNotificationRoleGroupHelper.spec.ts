import {AuthorNotificationRoleGroupHelper} from '../js/factory/AuthorNotificationRoleGroupHelper';
declare var angular:any;
describe('Given RolesRoleGroup Helper', function () {

	var authorNotificationRoleGroupHelper;

	beforeEach(angular.mock.module('FxPApp'));
	
	beforeEach(angular.mock.inject(function ( _AuthorNotificationRoleGroupHelper_) {
		authorNotificationRoleGroupHelper = _AuthorNotificationRoleGroupHelper_;
	}));
	
	describe('When isRolesRoleGroupAvailableToAdd is called and child is not passed', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager"
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager"
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}
			]
			response = authorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToAdd(roleGroupDetails[0], null);
		})

		it('Then it should return true', () => {
			expect(response).toEqual(true);
		});

	});
	describe('When isRolesRoleGroupAvailableToAdd is called and child is also passed', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": false,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager"
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isChildSelected":true
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}
			]
			response = authorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToAdd(roleGroupDetails[0], roleGroupDetails[0].BusinessRoles[1]);
		})

		it('Then it should return true', () => {
			expect(response).toEqual(true);
		});

	});
	describe('When isRolesRoleGroupAvailableToAdd is called and child is also passed and item is unchecked', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": false,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager"
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isChildSelected": false
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}
			]
			authorNotificationRoleGroupHelper.selectedRolesforAddButton.push(roleGroupDetails[0].BusinessRoles[1]);
			response = authorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToAdd(roleGroupDetails[0], roleGroupDetails[0].BusinessRoles[1]);
		})

		it('Then it should return false', () => {
			expect(response).toEqual(false);
		});

	});
	describe('When isRolesRoleGroupAvailableToRemove is called and child is not passed', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isRecepientsParentSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager"
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager"
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}
			]
			response = authorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToRemove(roleGroupDetails[0], null);
		})

		it('Then it should return true', () => {
			expect(response).toEqual(true);
		});

	});
	describe('When isRolesRoleGroupAvailableToRemove is called and child is also passed', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isRecepientsParentSelected": false,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager"
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isRecepientsChildSelected": true
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}
			]
			response = authorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToRemove(roleGroupDetails[0], roleGroupDetails[0].BusinessRoles[1]);
		})

		it('Then it should return true', () => {
			expect(response).toEqual(true);
		});

	});
	describe('When isRolesRoleGroupAvailableToRemove is called and child is also passed and item is unchecked', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isRecepientsParentSelected": false,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager"
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isRecepientsChildSelected": false
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}
			]
			authorNotificationRoleGroupHelper.selectedRolesforRemoveButton.push(roleGroupDetails[0].BusinessRoles[1]);
			response = authorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToRemove(roleGroupDetails[0], roleGroupDetails[0].BusinessRoles[1]);
		})

		it('Then it should return false', () => {
			expect(response).toEqual(false);
		});

	});
	describe('When manageRoleGroupItems is called to add', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": true
				}
			]
			authorNotificationRoleGroupHelper.manageRoleGroupItems(roleGroupDetails[0], "AddedItems");
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoleGroups should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoleGroups.length).toEqual(1);
		});
	});
	describe('When manageRoleGroupItems is called to remove', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": true
				}
			]
			authorNotificationRoleGroupHelper.selectedRoleGroups = [];
			authorNotificationRoleGroupHelper.selectedRoleGroups.push(roleGroupDetails[0]);
			authorNotificationRoleGroupHelper.manageRoleGroupItems(roleGroupDetails[0], "RemovedItems");
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoleGroups should have null', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoleGroups.length).toEqual(0);
		});
	});
	describe('When manageRoleItems is called to add', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager"
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager"
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}];
			authorNotificationRoleGroupHelper.manageRoleItems(roleGroupDetails[0].BusinessRoles[0], "AddedItems", roleGroupDetails[0]);
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoleGroups should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoleGroups.length).toEqual(1);
		});
	});
	describe('When manageRoleItems is called to add', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": false,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager",
							"isChildSelected":true
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager"
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}];
			authorNotificationRoleGroupHelper.manageRoleItems(roleGroupDetails[0].BusinessRoles[0], "AddedItems", roleGroupDetails[0]);
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoles should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoles.length).toEqual(1);
		});
	});
	describe('When manageRoleItems is called to remove and child is selected', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": false,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager",
							"isReceipentsChildSelected": true
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isReceipentsChildSelected": true
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager",
							"isReceipentsChildSelected": true
						}
					]
				}];
			authorNotificationRoleGroupHelper.selectedRoles.push(roleGroupDetails[0].BusinessRoles[0], roleGroupDetails[0].BusinessRoles[1], roleGroupDetails[0].BusinessRoles[2]);
			authorNotificationRoleGroupHelper.manageRoleItems(roleGroupDetails[0].BusinessRoles[0], "RemovedItems", roleGroupDetails[0]);
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoles should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoles.length).toEqual(2);
		});
	});
	describe('When manageRoleItems is called to remove and parent is selected', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isReceipentsParentSelected": true,
					"isRecipientsItem": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager",
							"isReceipentsChildSelected": true,
							"isRecipientsItem": true,
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isReceipentsChildSelected": true,
							"isRecipientsItem": true,
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager",
							"isReceipentsChildSelected": false
						}
					]
				}];
			authorNotificationRoleGroupHelper.selectedRoleGroups.push(roleGroupDetails[0]);
			authorNotificationRoleGroupHelper.manageRoleItems(roleGroupDetails[0].BusinessRoles[2], "RemovedItems", roleGroupDetails[0]);
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoleGroups should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoles.length).toEqual(2);
			expect(authorNotificationRoleGroupHelper.selectedRoleGroups.length).toEqual(0);
		});
	});
	describe('When addRemoveRolesRoleGroup is called to add child and action is add', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": false,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager",
							"isChildSelected": true,
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isChildSelected": true,
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				},
				{
					"RoleGroupId": 4,
					"RoleGroupName": "Leader",
					"isParentSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 32,
							"BusinessRoleName": "CVP",
							"isChildSelected": true,
						},
						{
							"BusinessRoleId": 90,
							"BusinessRoleName": "Services Leader",
							"isChildSelected": true,
						}
					]
				}
			];
			authorNotificationRoleGroupHelper.addRemoveRolesRoleGroup(roleGroupDetails, "Add");
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoles should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoles.length).toEqual(2);
		});
	});
	describe('When addRemoveRolesRoleGroup is called to add parent and action is add', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": true
				}
			];
			authorNotificationRoleGroupHelper.addRemoveRolesRoleGroup(roleGroupDetails, "Add");
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoleGroups should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoleGroups.length).toEqual(1);
		});
	});

	describe('When addRemoveRolesRoleGroup is called to add child and action is Remove', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": false,
					"isRecipientsItem": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager",
							"isChildSelected": true,
							"isRecipientsItem": true,
							"isRecepientsChildSelected": true
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isChildSelected": true,
							"isRecipientsItem": true,
							"isRecepientsChildSelected": true
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				},
				{
					"RoleGroupId": 4,
					"RoleGroupName": "Leader",
					"isParentSelected": true,
					"isRecipientsItem": true,
					"isSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 32,
							"BusinessRoleName": "CVP",
							"isChildSelected": true,
							"isRecipientsItem": true,
							"isRecepientsChildSelected": true
						},
						{
							"BusinessRoleId": 90,
							"BusinessRoleName": "Services Leader",
							"isChildSelected": true,
							"isRecipientsItem": true,
							"isRecepientsChildSelected": true
						}
					]
				}
			]
			authorNotificationRoleGroupHelper.selectedRoles.push(roleGroupDetails[0].BusinessRoles[0]);
			authorNotificationRoleGroupHelper.addRemoveRolesRoleGroup(roleGroupDetails, "Remove");
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoles should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoles.length).toEqual(0);
		});
	});
	describe('When addRemoveRolesRoleGroup is called to add parent and action is Remove', () => {
		var response;
		beforeEach(function () {
			var roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isRecepientsParentSelected": true
				}
			];
			authorNotificationRoleGroupHelper.selectedRoleGroups.push(roleGroupDetails[0]);
			authorNotificationRoleGroupHelper.addRemoveRolesRoleGroup(roleGroupDetails, "Remove");
		});
		it('Then authorNotificationRoleGroupHelper.selectedRoleGroups should have value', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoleGroups.length).toEqual(0);
		});
	});
	describe('When resetSelectedRolesRoleGroupArray  is called ', () => {
		var response;
		beforeEach(function () {
			authorNotificationRoleGroupHelper.resetSelectedRolesRoleGroupArray();
		});
		it('Then it should reset arrays', () => {
			expect(authorNotificationRoleGroupHelper.selectedRoleGroups.length).toEqual(0);
			expect(authorNotificationRoleGroupHelper.selectedRoles.length).toEqual(0);
		});
	});


});