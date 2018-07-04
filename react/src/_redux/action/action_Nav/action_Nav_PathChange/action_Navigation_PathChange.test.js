import action_Navigation_PathChange, {TYPE} from '.';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

describe('action navigation path change should', () => {

    describe('run', () => {
        it('resolves true to be true ', () => {
            expect(true).toBe(true);
        });
    });

    describe('dispatch action that ', async () => {
        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);

        it('resolves with correct path', () => {

            // Arrange
            const expected = 'here';
            const expectedActions = [
                {
                    type: TYPE,
                    payload: expected
                }];
            const store = mockStore({});

            // Act
            store.dispatch(action_Navigation_PathChange(expected)).then(() => {
                const actual = store.getActions();
                // Assert
                expect(actual.length).toBe(1);
                expect(actual).toEqual(expectedActions);
            });
        });
    });

});
