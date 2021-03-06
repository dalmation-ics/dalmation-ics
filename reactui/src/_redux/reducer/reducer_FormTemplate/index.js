import _ from 'lodash';

import moment from 'moment';
import type {Action, State} from 'src/_core/redux/types';
import actionStatus, {ActionStatus} from 'src/_core/redux/types/actionStatus';

import * as action_FormTemplate_CancelCheckForUpdates
	from '../../action/action_FormTemplate/action_FormTemplate_CancelCheckForUpdates';
import * as action_FormTemplate_CancelUpdateForms
	from '../../action/action_FormTemplate/action_FormTemplate_CancelUpdateForms';
import * as action_FormTemplate_CheckForUpdates
	from '../../action/action_FormTemplate/action_FormTemplate_CheckForUpdates';
import * as action_FormTemplate_GetFormsIndex from '../../action/action_FormTemplate/action_FormTemplate_GetFormsIndex';
import * as action_FormTemplate_UpdateForms from '../../action/action_FormTemplate/action_FormTemplate_UpdateForms';

export type StateFormTemplate = State & {
	checkForUpdatesStatus: ActionStatus | null,
	checkForUpdatesError: string | null,
	updatesAvailable: boolean | null,
	lastCheckForUpdate: Date | null,
	updateFormsStatus: ActionStatus | null,
	updateFormsError: string | null,
	updatePendingRefresh: boolean | null,
	lastUpdate: Date | null,
	getFormsIndexStatus: ActionStatus | null,
	getFormsIndexError: string | null,
	formIndex: number | null,
	selectedRepositoryUrl: string | null,
}

const DEFAULT_STATE: StateFormTemplate = {

	/**
	 * UpdateCheck
	 *
	 * Affected by:
	 * action_FormTemplate_CheckForUpdates
	 * action_FormTemplate_CancelCheckForUpdates
	 */
	checkForUpdatesStatus: actionStatus.UNINITIALIZED,
	checkForUpdatesError: null,
	updatesAvailable: null,
	lastCheckForUpdate: null,

	/**
	 * UpdateForms
	 *
	 * Affected by:
	 * action_FormTemplate_UpdateForms
	 * action_FormTemplate_CancelUpdateForms
	 */
	updateFormsStatus: actionStatus.UNINITIALIZED,
	updateFormsError: null,
	updatePendingRefresh: false,
	lastUpdate: null,

	/**
	 * GetFormsIndex
	 *
	 * Affected by:
	 * action_FormTemplate_GetFormsIndex
	 */
	getFormsIndexStatus: actionStatus.UNINITIALIZED,
	getFormsIndexError: actionStatus.ERROR,
	formIndex: null,
	/**
	 * Affected by:
	 * action_FormTemplate_SelectRepository
	 */
	selectedRepositoryUrl: null,
};

export default (previousState: State = DEFAULT_STATE, action: Action) => {

	let newState = _.cloneDeep(previousState);

	const {type, payload, status} = action;
	switch (type) {

		/**
		 * action_FormTemplate_CancelCheckForUpdates
		 */
		case action_FormTemplate_CancelCheckForUpdates.TYPE : {
			newState.checkForUpdatesStatus = actionStatus.CANCELLED;
			break;
		}

		/**
		 * action_FormTemplate_CheckForUpdates
		 */
		case action_FormTemplate_CheckForUpdates.TYPE: {

			newState.checkForUpdatesStatus = status;
			switch (status) {

				// Started
				case actionStatus.STARTED: {
					newState.checkForUpdatesError = null;
					break;
				}

				// Complete
				case actionStatus.COMPLETE : {
					newState.updatesAvailable = payload;
					newState.lastCheckForUpdate = moment().format();
					break;
				}

				// Error
				case actionStatus.ERROR : {
					newState.checkForUpdatesError = payload;
					break;
				}

				default:
					break;
			}
			break;
		}

		/**
		 * action_FormTemplate_CancelUpdateForms
		 */
		case action_FormTemplate_CancelUpdateForms.TYPE: {
			newState.updateFormsStatus = status;
			break;
		}

		/**
		 * action_FormTemplate_UpdateForms
		 */
		case action_FormTemplate_UpdateForms.TYPE : {
			newState.updateFormsStatus = status;
			switch (status) {

				// Started
				case actionStatus.STARTED : {
					newState.updateFormsError = null;
					newState.updatePendingRefresh = false;
					break;
				}

				// Complete
				case actionStatus.COMPLETE : {
					newState.updatePendingRefresh = true;
					newState.updatesAvailable = false;
					newState.lastUpdate = moment().format();
					break;
				}

				// Error
				case actionStatus.ERROR : {
					newState.updateFormsError = payload;
					break;
				}

				default:
					break;

			}
			break;
		}

		/**
		 * action_FormTemplate_GetFormsIndex
		 */
		case action_FormTemplate_GetFormsIndex.TYPE : {
			newState.getFormsIndexStatus = status;
			switch (status) {

				// Started
				case actionStatus.STARTED: {
					newState.getFormsIndexError = null;
					break;
				}

				// Complete
				case actionStatus.COMPLETE: {
					newState.formIndex = payload;
					break;
				}

				// Error
				case actionStatus.ERROR: {
					newState.getFormsIndexError = payload;
					break;
				}

				default:
					break;
			}
			break;
		}

		default:
			break;
	}

	return newState;

};

