import { createStore } from "react";
import throttle from "lodash.throttle";
import { loadState, saveState } from "./localStorage";
import App from "./../App";
const persistedState = loadState();

const store = createStore(App, persistedState);
store.subscribe(() => {
	saveState({
		todos: store.getState().todos,
	});
});

store.subscribe(
	throttle(() => {
		saveState({
			todos: store.getState().todos,
		});
	}, 1000),
);
