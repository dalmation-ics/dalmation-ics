import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import action_Archive_Suite_Rename, {TYPE} from '.';

describe('Action archive suite Rename should ', () => {

	describe('Basics', () => {

		it('resolves true to be true ', () => {
			expect(true).toBe(true);
		});
	});

	describe('dispatch action that ', async () => {
		const middlewares = [thunk];
		const mockStore = configureMockStore(middlewares);

		it('resolves with correct name', () => {

			// Arrange
			const expected = 'some name';
			const expectedActions = [
				{
					type: TYPE,
					payload: expected,
				}];
			const store = mockStore({});

			// Act
			store.dispatch(action_Archive_Suite_Rename(expected)).then(() => {
				const actual = store.getActions();
				// Assert
				expect(actual.length).toBe(1);
				expect(actual).toEqual(expectedActions);
			});
		});
	});
});
