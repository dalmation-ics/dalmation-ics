// @flow
import type {Action, Dispatch} from '../../../types';

import * as actionStatus from 'src/_core/redux/actionStatus';
import ipcRWrapper from 'src/_core/electron/IpcRWrapper';
import {ACT_CHECK_PASSED_FILE} from 'src/_core/contract/exportBridge';
import action_Archive_Suite_Load
  from 'src/_redux/actions/action_Archive_Suite_Suite/action_Archive_Suite_Suite_Load';
import path from 'path';

export const TYPE = 'TYPE_ARCHIVE_CHECK_PASSED_FILE';
export default () => (dispatch: Dispatch) => new Promise((resolve, reject) => {

  // Dispatch START
  dispatch(({type: TYPE, status: actionStatus.STARTED}: Action));
  try {
    // Prompt Electron to check for passed archive
    ipcRWrapper.prompt(ACT_CHECK_PASSED_FILE, (err, response) => {

      if (!err) {
        let filePath = path.normalize(response.filePath);
        try {
          if (response !== null) {

            // Dispatch COMPLETE
            dispatch(({
              type: TYPE,
              status: actionStatus.COMPLETE,
              payload: filePath,
            }: Action));
            dispatch(action_Archive_Suite_Load(filePath)).
                then((err, response) => {
                  resolve(err, response);
                });
            // dispatch(action_Navigation_RedirectUser('/suite'));

          } else {

            dispatch(({
              type: TYPE,
              status: actionStatus.COMPLETE,
              payload: false,
            }: Action));

            resolve(false);
          }
        } catch (exc) {
          // Dispatch ERROR
          dispatch(
              ({type: TYPE, status: actionStatus.ERROR, payload: exc}: Action));
          console.log(exc);
          reject(exc);
        }

      } else {
        throw err;
      }

    });
  } catch (exc) {
    // Dispatch ERROR
    dispatch(
        ({type: TYPE, status: actionStatus.ERROR, payload: exc}: Action));

    reject(exc);
  }
})
// .then(result => {
//     if (result !== false)
//         dispatch(action_Navigation_RedirectUser('/suite'));
// })