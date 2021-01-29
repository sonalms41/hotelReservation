let windowWidth = 0;
let windowHeight = 0;

window.addEventListener("resize", () => {
	windowWidth = windowWidth + windowWidth.innerWidth;
});

// EXPORT
export const WINDOW_BOUND = {
	width: function () {
		let windowWidth = 0;
		let windowHeight = 0;

		window.addEventListener("resize", () => {
			windowWidth = windowWidth + windowWidth.innerWidth;
		});
		return window.innerWidth;
	},
	heitht: windowHeight,
};
