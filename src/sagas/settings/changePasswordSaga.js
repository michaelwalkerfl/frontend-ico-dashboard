import { all, takeLatest, call, put, fork } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import { post } from '../../utils/fetch';
import Toast from '../../utils/toaster';


import { changePassword, verifyChangePassword, resetStore } from '../../redux/modules/settings/changePassword';

/*
 * Change password
 */

function* changePasswordIterator({ payload }) {
  try {
    const data = yield call(post, '/user/me/changePassword/initiate', payload);
    yield put(changePassword.success(Object.assign({}, data, payload)));
  } catch (e) {
    yield put(changePassword.failure(new SubmissionError({ _error: e.error })));
    yield call([Toast, Toast.red], { message: e.message });
  }
}

function* changePasswordSaga() {
  yield takeLatest(
    changePassword.REQUEST,
    changePasswordIterator
  );
}

/*
 * Verify change password
 */

function* verifyChangePasswordIterator({ payload }) {
  try {
    yield call(post, '/user/me/changePassword/verify', payload);
    yield put(verifyChangePassword.success());
    yield call([Toast, Toast.green], { message: 'Password changed' });
    yield put(resetStore());
  } catch (e) {
    yield put(verifyChangePassword.failure(new SubmissionError({ _error: e.error })));
    yield call([Toast, Toast.red], { message: e.message });
  }
}

function* verifyChangePasswordSaga() {
  yield takeLatest(
    verifyChangePassword.REQUEST,
    verifyChangePasswordIterator
  );
}

/*
 * Export
 */

export default function* () {
  yield all([
    fork(changePasswordSaga),
    fork(verifyChangePasswordSaga)
  ]);
}
