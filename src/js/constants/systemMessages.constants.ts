export class SYSTEM_MESSAGE_UI {
	public static SYSTEM_MESSAGE = `System Message`;
	public static SYSTEM_MESSAGES = `System Messages`;
	public static ADD = `Add`;
	public static EDIT = `Edit`;
	public static SAVE = `Save`;
	public static DELETE = `Delete`;
	public static CANCEL = `Cancel`;
	public static ACTIVE = `Active`;
	public static EXPIRED = `Expired`;
	public static ADD_MESSAGES = `${SYSTEM_MESSAGE_UI.ADD} Message`;
	public static SYSTEM_MESSAGE_DESC = `Create and manage ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}. The alert messages can be set to show up for all pages or only on a specified page.`;
	public static ITEMS_TO_DISPLAY = `Items to display:`;
	public static MESSAGE = {
		TYPE: `Type`,
		MESSAGE: `Message`,
		WORKFLOW: `Workflow(L0)`,
		FUNCTION: `Function(L1)`,
		START: `Start Date/Time`,
		END: `End Date/Time`,
		STATUS: `Status`
	};

	public static TYPE = {
		INTERMITTENT: `Intermittent`,
		SYSTEM_DOWN: `System Down`
	};
	public static BUSINESS_CAPABILITY = `Business Capability (L0)`;
	public static BUSINESS_FUNCTION = `Business Function (L1)`;
	public static MESSAGE_TO_USER = `Message to User`;
	public static ADD_SYSTEM_MESSAGE = `${SYSTEM_MESSAGE_UI.ADD} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}`;
	public static EDIT_SYSTEM_MESSAGE = `${SYSTEM_MESSAGE_UI.EDIT} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}`;
	public static DELETE_SYSTEM_MESSAGE = `${SYSTEM_MESSAGE_UI.DELETE} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}`;

	public static DELETE_CONFIRMATION = `Are you sure you want to delete this ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}?`;

	public static ERRORS: any = {
		CANNOT_FETCH_SYSTEM_MESSAGE: `The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}s could not be fetched.`,
		CANNOT_FETCH_BBUSINESS_WORKFLOW: `The business Workflows could not be fetched.`,
		CANNOT_ADD_SYSTEM_MESSAGE: `The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be added.`,
		CANNOT_UPDATE_SYSTEM_MESSAGE: `The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be updated.`,
		CANNOT_DELETE_SYSTEM_MESSAGE: `The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be deleted.`,
		CANNOT_FETCH_PLANEDDOWNTIME: "The planned downtime messages could not be fetched.",

		BUSINESS_CAPABILITY_REQUIRED: `${SYSTEM_MESSAGE_UI.BUSINESS_CAPABILITY} is Required.`,
		BUSINESS_FUNCTION_REQUIRED: `${SYSTEM_MESSAGE_UI.BUSINESS_FUNCTION} is Required.`,
		MESSAGE_REQUIRED: `${SYSTEM_MESSAGE_UI.MESSAGE_TO_USER} is Required.`,
		START_DATE_REQUIRED: `${SYSTEM_MESSAGE_UI.MESSAGE.START} is Required.`,
		END_DATE_REQUIRED: `${SYSTEM_MESSAGE_UI.MESSAGE.END} is Required.`,
		END_DATE_MIN: `${SYSTEM_MESSAGE_UI.MESSAGE.END} must be after ${SYSTEM_MESSAGE_UI.MESSAGE.START}.`
	}

	public static SUCCESS = {
		SYSTEM_MESSAGE_ADDED: `The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully added.`,
		SYSTEM_MESSAGE_UPDATED: `The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully updated.`,
		SYSTEM_MESSAGE_DELETED: `The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully deleted.`
	}

	public static LOADING_TEXTS = {
		FETCHING_MESSAGES: `Loading ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}`,
		ADDING_MESSAGE: `Adding ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}`,
		UPDATING_MESSAGE: `Updating ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}`,
		DELETING_MESSAGE: `Deleting ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}`
	}

	public static PAGINATION = { PREV: `Prev`, NEXT: `Next` }
}