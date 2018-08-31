import { CommonUtils } from "../utils/CommonUtils";
import { FxpConstants } from "../common/ApplicationConstants";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Factory
 */

/**
* A main factory which acts as an helper for AuthorNotificationController. This is the factory having common functionalities
such as check uncheck test box, add and remove functionality.
* @class Fxp.Factory.AuthorNotificationHelper
* @classdesc An helper factory for AuthorNotificationController in FxPApp module
* @example <caption> 
*  //How To use this factory
*  angular.module('FxPApp').controller('AuthorNotificationController', ['AuthorNotificationRoleGroupHelper', AuthorNotificationRoleGroupHelper]);
*  function AuthorNotificationRoleGroupHelper(AnyDependency) }
*/
export class AuthorNotificationRoleGroupHelper {
	//this array contains id which will determine whether to enable/disable add button
	selectedRolesforAddButton: any = [];
	//this array contains id which will determine whether to enable/disable remove button
	selectedRolesforRemoveButton: any = [];
	//contains the final list of roles which need to be published
	selectedRoles: any = [];
	//contains the final list of roleGroup which need to be published
	selectedRoleGroups: any = [];
	constructor() {
	}
	/**
	*A method to check if roles or role group has been selected to Add to recepients list,
	the return boolean value is decided if selectedRolesforAddButton array is empty or has value.
	* @method Fxp.Controllers.AuthorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToAdd
	* @param {any} roleGroupItem selected parent item from master list
	* @param {any} roleItem selected child item from master list
	* @example <caption> Example to use isRolesRoleGroupAvailableToAdd</caption>
	* AuthorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToAdd(roleGroupItem,roleItem)
	*/
	isRolesRoleGroupAvailableToAdd(roleGroupItem, roleItem): boolean {
		let self = this;
		//if no child item and only parent is passed
		if (CommonUtils.isNullOrEmpty(roleItem)) {
			angular.forEach(roleGroupItem.BusinessRoles, function (item) {
				if (!angular.isDefined(item.isRecipientsItem)) {
					item.isChildSelected = roleGroupItem.isParentSelected;
				}
				self.setAddButtonState(item);
			});
		} else {
			//if child item is passed along with parent item
			self.setAddButtonState(roleItem);
			roleGroupItem.isParentSelected = roleGroupItem.BusinessRoles.every(function (item) { return item.isChildSelected; });
		}
		return self.selectedRolesforAddButton.length > 0;
	}

	/**
   *Based on this function we will populate the array and determine if any items are ready to
	add or not based on array.
   * @method Fxp.Controllers.AuthorNotificationRoleGroupHelper.setAddButtonState
   * @param {any}  roleItem child item from master list
   * @example <caption> Example to use setAddButtonState</caption>
   * AuthorNotificationRoleGroupHelper.setAddButtonState(roleItem)
   */
	setAddButtonState(roleItem): void {
		var self = this;
		//check index of item
		let roleItemIndex = CommonUtils.getIndexOfObject(self.selectedRolesforAddButton, "BusinessRoleId", roleItem.BusinessRoleId);
		//push if item is selected and not available else if  remove role an uncheck checkbox
		if (roleItem.isChildSelected && roleItemIndex == -1) {
			self.selectedRolesforAddButton.push(roleItem);
		} else if (!roleItem.isChildSelected && (roleItemIndex > -1)) {
			self.selectedRolesforAddButton.splice(roleItemIndex, 1);
		}
	}

	/**
	 *A method to use Select/Unselect from Recepients List
	 * @method Fxp.Controllers.AuthorNotificationRoleGroupHelper.selectedRoleGroupRecepientsItems
	 * @param {any} roleGroupItem selected item is parent of recepients list
	 * @param {any} roleItem selected item child in recepients list
	 * @example <caption> Example to use selectedRoleGroupRecepientsItems</caption>
	 * AuthorNotificationRoleGroupHelper. selectedRoleGroupRecepientsItems(roleGroupItem, roleItem)
	 */
	isRolesRoleGroupAvailableToRemove(roleGroupItem, roleItem): boolean {
		var self = this;
		//if no child item only parent is passed
		if (CommonUtils.isNullOrEmpty(roleItem)) {
			angular.forEach(roleGroupItem.BusinessRoles, function (item, key) {
				item.isRecepientsChildSelected = roleGroupItem.isRecepientsParentSelected;
				self.setRemoveButtonState(item);
			});
		} else {
			//if child item is passed along with parent item
			self.setRemoveButtonState(roleItem);
			//check roleGroupItem if all roles are selected
			roleGroupItem.isRecepientsParentSelected = roleGroupItem.BusinessRoles.filter(function (roles) {
				return (angular.isDefined(roles.isRecipientsItem));
			}).every(function (roles) {
				return roles.isRecepientsChildSelected;
			});
		}
		return self.selectedRolesforRemoveButton.length > 0;
	}

	/**
   *A method to use Enable/Disable remove Button based on selectedRolesforRemoveButton size we will enable Remove button
   * @method Fxp.Controllers.AuthorNotificationRoleGroupHelper.setRemoveButtonState
   * @example <caption> Example to use setRemoveButtonState</caption>
   * AuthorNotificationRoleGroupHelper.setRemoveButtonState()
   */
	setRemoveButtonState(roleItem): void {
		var self = this;
		//check index of item
		var roleItemIndex = CommonUtils.getIndexOfObject(self.selectedRolesforRemoveButton, "BusinessRoleId", roleItem.BusinessRoleId);
		//push if item is selected and not available else remove id unchecked
		if (roleItem.isRecepientsChildSelected && roleItemIndex == -1) {
			self.selectedRolesforRemoveButton.push(roleItem);
		} else if (!roleItem.isRecepientsChildSelected && (roleItemIndex > -1)) {
			self.selectedRolesforRemoveButton.splice(roleItemIndex, 1);
		}
	}

	/**
	*A method to use  maintain audit infromation of  manageRoleGroupItem based on parent action track
	* @method Fxp.Controllers.AuthorNotificationRoleGroupHelper.manageRoleGroupItem
	* @param {any} parent collection contains added and removed items
	* @param {string} action whether it is add or remove
	* @example <caption> Example to use manageRoleGroupItem</caption>
	* AuthorNotificationRoleGroupHelper.manageRoleGroupItem(parent,action)
	*/
	manageRoleGroupItems(roleGroupItem, action): void {
		let self = this;
		//check if roleGroupItem item is available
		let roleGroupindex = CommonUtils.getIndexOfObject(self.selectedRoleGroups, "RoleGroupId", roleGroupItem.RoleGroupId);
		//add roleGroupItem item
		if (action == FxpConstants.ActionTypes.Add) {
			if (roleGroupindex == -1)
				self.selectedRoleGroups.push(roleGroupItem);
		} else {
			//remove roleGroupItem 
			if (roleGroupindex > -1)
				self.selectedRoleGroups.splice(roleGroupindex, 1);
		}
	}
	/**
	*A method to add or remove items from Roles and Role Group Array
	* @method Fxp.Controllers.AuthorNotificationRoleGroupHelper.manageRoleItem
	* @param {any} roleItem contains roleItem item
	* @param {string} action string that specifies add or remove
	* @param {int} roleGroupItem contains roleGroupItem item
	* @example <caption> Example to use manageRoleItem</caption>
	* AuthorNotificationRoleGroupHelper.manageRoleItem(roleItem, action, roleGroupItem)
	*/
	manageRoleItems(roleItem, action, roleGroupItem): void {
		var self = this;
		roleItem.parentId = roleGroupItem.RoleGroupId;
		//remove roleGroupItems from selectedRoleGroups array
		var removeRoleGroupItem = function removeRoleGroupItem(parentId) {
			let index = CommonUtils.getIndexOfObject(self.selectedRoleGroups, "RoleGroupId", parentId);
			if (index > -1)
				self.selectedRoleGroups.splice(index, 1);
		}
		//remove role items from selectedRoles array
		var removeRoleItems = function removeRoleItems(roleGroupItem) {
			self.selectedRoles = self.selectedRoles.filter(function (role) {
				return role.parentId != roleGroupItem.RoleGroupId;
			});
		}
		//push role items in selectedRoles array
		var pushRoleItems = function pushRoleItems(roleGroupItem) {
			for (let i = 0; i < roleGroupItem.BusinessRoles.length; i++) {
				if (roleGroupItem.BusinessRoles[i].isRecipientsItem == true)
					self.selectedRoles.push(roleGroupItem.BusinessRoles[i]);
			}
		}
		//find index of child item in selectedRoles array
		let roleItemIndex = CommonUtils.getIndexOfObject(self.selectedRoles, "BusinessRoleId", roleItem.BusinessRoleId);
		switch (action) {
			//Add item from Role Group list to recepients list
			case FxpConstants.ActionTypes.Add:
				//push if child item doesn't exist in selectedRoles array
				if (roleItemIndex == -1 && !roleGroupItem.isParentSelected)
					self.selectedRoles.push(roleItem);
				else {
					//find index of parent item in selectedRoleGroups array
					let roleGroupItemIndex = CommonUtils.getIndexOfObject(self.selectedRoleGroups, "RoleGroupId", roleGroupItem.RoleGroupId);
					//add if parent item not there and remove child items from selectedRoles array
					if (roleGroupItemIndex == -1) {
						self.selectedRoleGroups.push(roleGroupItem);
						removeRoleItems(roleGroupItem);
					}
				}
				break;
			//Remove item from recepients list
			case FxpConstants.ActionTypes.Remove:
				//delete role item from selectedRoles if found
				if (roleItemIndex > -1) {
					self.selectedRoles.splice(roleItemIndex, 1);
				} else {
					//if no role item found in selectedRoles array delete parent Item from selectedRoleGroups array and push child item to selectedRoles array
					removeRoleGroupItem(roleGroupItem.RoleGroupId);
					pushRoleItems(roleGroupItem);
				}
				break;
		}
	}

	/**
   *A method to flush selectedRoleGroups and selectedRoles array
   * @method Fxp.Controllers.AuthorNotificationRoleGroupHelper.resetSelectedRolesRoleGroupArray
   * @example <caption> Example to use resetSelectedRolesRoleGroupArray</caption>
   * AuthorNotificationRoleGroupHelper.resetSelectedRolesRoleGroupArray()
   */
	resetSelectedRolesRoleGroupArray(): void {
		let self = this;
		self.selectedRoleGroups = [];
		self.selectedRoles = [];
	}

	addRemoveRolesRoleGroup(roleGroupDetails, action): any {
		var self = this;
		let roleGroupsListLength = roleGroupDetails.length;
		let focusIndex = false;
		let isFocusedElement = false;
		let isRoleGroupToAdd = false;

		//common function to add/remove roles
		var addRemoveRoles = function addRemoveRoles(roleGroupIndex, action) {
			let roleLength = roleGroupDetails[roleGroupIndex].BusinessRoles.length;
			let roles = roleGroupDetails[roleGroupIndex].BusinessRoles;
			isRoleGroupToAdd = false;
			for (let roleIndex = 0; roleIndex < roleLength; roleIndex++) {
				if (action == "Add")
					addRolesToRecepientsList(roles, roleIndex, roleGroupIndex);
				else
					removeRolesFromRecepientsList(roles, roleIndex, roleGroupIndex);
			}
			//show parentitem roleGroupIndex.e roleGroup in UI if any child is added to recepients list 
			if (action == "Add" && isRoleGroupToAdd)
				displayRoleGroupInRecepientsList(roleGroupIndex);
			//remove role group item from UI if all child are unselected
			if (action == "Remove") {
				removeDisplayRoleGroupInRecepientsList(roleGroupIndex);
			}

		}

		//add Roles to recepients list
		var addRolesToRecepientsList = function addRolesToRecepientsList(roles, roleIndex, roleGroupIndex) {
			if ((roles[roleIndex].isChildSelected) && (!angular.isDefined(roles[roleIndex].isRecipientsItem))) {
				// adding a flag to child item based on which it will b rendered in recepients list
				roles[roleIndex].isRecipientsItem = true;
				//if any role is added set flag for rolegroup to be added in UI 
				isRoleGroupToAdd = true;
				//set focus once on rolegroup item which is displayed in UI
				if (!isFocusedElement)
					roleGroupDetails[roleGroupIndex].isFocusedElement = isFocusedElement = true;
				// if there are any roles to be added manageRoleItems will add roles to recepients list
				self.manageRoleItems(roles[roleIndex], FxpConstants.ActionTypes.Add, roleGroupDetails[roleGroupIndex]);
			}
		}

		//display RoleGroup item on UI if any role is selected
		var displayRoleGroupInRecepientsList = function displayRoleGroupInRecepientsList(roleGroupIndex) {
			//check if item is already not in recepients list
			if ((!angular.isDefined(roleGroupDetails[roleGroupIndex].isRecipientsItem))) {
				roleGroupDetails[roleGroupIndex].isRecipientsItem = true;
			}
			//while displaying in recepients list expand the accordian
			roleGroupDetails[roleGroupIndex].isAccordianExpanded = true;
		}

		//reomve Role Group item from UI if all childs are removed
		var removeDisplayRoleGroupInRecepientsList = function removeDisplayRoleGroupInRecepientsList(roleGroupIndex) {
			var rolesCount = availableRolesCount(roleGroupIndex);
			//if there are no child available remove parent item from recepients list
			if (rolesCount === 0) {
				delete roleGroupDetails[roleGroupIndex].isRecipientsItem;
			}
			//uncheck role group flag 
			roleGroupDetails[roleGroupIndex].isRecepientsParentSelected = false;
			//check/uncheck flag based how many role available on recepeints list 
			roleGroupDetails[roleGroupIndex].isParentSelected = self.isRolesInReciepientList(roleGroupDetails[roleGroupIndex]);
		}

		var availableRolesCount = function availableRolesCount(roleGroupIndex) {
			var count = roleGroupDetails[roleGroupIndex].BusinessRoles.reduce(function (item, roleItem) {
				return item + ((angular.isDefined(roleItem.isRecipientsItem)));
			}, 0);
			return count;
		}
		//remove role from recepient list
		var removeRolesFromRecepientsList = function removeRolesFromRecepientsList(roles, roleIndex, roleGroupIndex) {
			if ((roles[roleIndex].isRecepientsChildSelected) && (angular.isDefined(roles[roleIndex].isRecipientsItem))) {
				delete roles[roleIndex].isRecipientsItem;
				roles[roleIndex].isChildSelected = false;
				self.manageRoleItems(roles[roleIndex], FxpConstants.ActionTypes.Remove, roleGroupDetails[roleGroupIndex]);
			}
			roles[roleIndex].isRecepientsChildSelected = false;
		}

		//common function to add/remove roleGroup item which doesnot have any roles
		var addRemoveRoleGroup = function addRemoveRoleGroup(roleGroupIndex, action) {
			if (action == "Add")
				addRoleGroupsToRecepientsList(roleGroupIndex);
			else
				removeRoleGroupsFromRecepientsList(roleGroupIndex)
		}

		//add role group item to recepient list which doesnot have any roles
		var addRoleGroupsToRecepientsList = function addRoleGroupsToRecepientsList(roleGroupIndex) {
			if ((roleGroupDetails[roleGroupIndex].isParentSelected) && (!angular.isDefined(roleGroupDetails[roleGroupIndex].isRecipientsItem))) {
				roleGroupDetails[roleGroupIndex].isRecipientsItem = true;
				roleGroupDetails[roleGroupIndex].isAccordianExpanded = true;
				if (!isFocusedElement)
					roleGroupDetails[roleGroupIndex].isFocusedElement = isFocusedElement = true;
				self.manageRoleGroupItems(roleGroupDetails[roleGroupIndex], FxpConstants.ActionTypes.Add);
			}
		}

		//remove role group item from recepient list which doesnot have any roles
		var removeRoleGroupsFromRecepientsList = function removeRoleGroupsFromRecepientsList(roleGroupIndex) {
			if ((roleGroupDetails[roleGroupIndex].isRecepientsParentSelected)) {
				delete roleGroupDetails[roleGroupIndex].isRecipientsItem;
				roleGroupDetails[roleGroupIndex].isRecepientsParentSelected = false;
				roleGroupDetails[roleGroupIndex].isParentSelected = false
				self.manageRoleGroupItems(roleGroupDetails[roleGroupIndex], FxpConstants.ActionTypes.Remove);
			}
		}

		// set focus on the role group item which is added or removed
		var setFocusToRoleGroupItem = function setFocusToRoleGroupItem(status) {
			for (let roleGroupIndex = 0; roleGroupIndex < roleGroupDetails.length; roleGroupIndex++) {
				if (!roleGroupDetails[roleGroupIndex].isParentSelected) {
					roleGroupDetails[roleGroupIndex].isFocused = status;
					break;
				}
			}
		}

		//iterate all roleGroups
		for (let roleGroupIndex = 0; roleGroupIndex < roleGroupsListLength; roleGroupIndex++) {
			//if business Role available check if any item is selected to add
			if (roleGroupDetails[roleGroupIndex].BusinessRoles) {
				//add or Remove role 
				addRemoveRoles(roleGroupIndex, action);
			} else {
				//add or Remove roleGroup
				addRemoveRoleGroup(roleGroupIndex, action);

			}
		}
		if (action == "Add" && !isFocusedElement)
			setFocusToRoleGroupItem(true);
		if (action == "Remove")
			setFocusToRoleGroupItem(true);
		return roleGroupDetails;
	}
	/**
	*A method to use Enable/Disable the Parent Link in roles Role group list based on items in recepients list
	* @method Fxp.Controllers.AuthorNotificationController.isRolegroupInReciepientList
	* @param {any} roleGroupItem object whichj we are going to dispaly in UI
	* @example <caption> Example to use isRolegroupInReciepientList</caption>
	* AuthorNotificationController.isParentisRolegroupInReciepientListLinkEnabled(roleGroupItem)
	*/
	isRolesInReciepientList(roleGroupItem): boolean {
		//check how many roles added to recepients list
		var roleLength = roleGroupItem.BusinessRoles.reduce(function (item, childItem) {
			return item + ((angular.isDefined(childItem.isRecipientsItem)));
		}, 0);
		return roleGroupItem.BusinessRoles.length === roleLength;
	}
	static AuthorNotificationRoleGroupHelper() {
		return new AuthorNotificationRoleGroupHelper();
	}
}
