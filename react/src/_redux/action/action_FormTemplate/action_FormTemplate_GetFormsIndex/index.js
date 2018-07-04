// @flow
import type {Action, Dispatch} from '../../../types';
import * as actionStatus from 'src/_core/redux/actionStatus';
import ipcRWrapper from 'src/_core/electron/IpcRWrapper';
import {ACT_GET_FORMS_INDEX} from 'src/_core/contract/formsBridge';

export const TYPE = 'TYPE_FORM_TEMPLATE_GETFORMSINDEX';
export default () => (dispatch: Dispatch) => new Promise((resolve, reject) => {
  try {
    // Dispatch START
    dispatch(({
      type: TYPE,
      status: actionStatus.STARTED,
    }: Action));

    // Prompot Electron to get forms index
    ipcRWrapper.prompt(ACT_GET_FORMS_INDEX, (err, result) => {

      if (!err) {
        // Dispatch COMPLETE
        dispatch(({
          type: TYPE,
          status: actionStatus.COMPLETE,
          payload: result,
        }: Action));
      } else {
        // Dispatch ERROR
        dispatch(({
          type: TYPE,
          status: actionStatus.ERROR,
          payload: err,
        }: Action));
      }

      // Resolve
      resolve(err, result);

    });
  } catch (exc) {
    reject(exc);
  }
});