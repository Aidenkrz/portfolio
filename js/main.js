$(() => {
const $app_window_1 = new $Window({ title: "Speen", resizable: true });
	$app_window_1.$content.append(`
	<img src="images/frog.gif" style="height: 100%; width: 100%; object-fit: contain">
	`);
	fake_closing($app_window_1);

    const $windows_and_$positioners = [
		[$app_window_1, $("#app-window-example")],
	];
	function position_windows() {
		for (const [$window, $positioning_el] of $windows_and_$positioners) {
			// in a separate loop to prevent layout thrashing (untested performance optimization)
			$positioning_el._new_offset = $positioning_el.offset();
		}
		for (const [$window, $positioning_el] of $windows_and_$positioners) {
			const { _new_offset, _old_offset } = $positioning_el;
			if (
				_new_offset.top !== _old_offset?.top ||
				_new_offset.left !== _old_offset?.left
			) {
				$window.restore(); // in case it was minimized or maximized
				$window.css({
					left: _new_offset.left,
					top: _new_offset.top,
					width: "",
					height: "",
				});
				$positioning_el._old_offset = _new_offset;
			}
		}
	}
	$(window).on("resize", position_windows);
	position_windows();

    function fake_closing($window) {
		$window.on("close", (event) => {
			event.preventDefault();
			$window.triggerHandler("closed");
			$window.closed = true;
			$window.hide();
			setTimeout(() => {
				// Restore position
				const $positioning_el = $windows_and_$positioners.find(([$other_window]) => $window === $other_window)[1];
				$window.restore(); // in case it was minimized or maximized
				$window.css({
					left: $positioning_el.offset().left,
					top: $positioning_el.offset().top,
					width: "",
					height: "",
				});
				// Fade back in
				$window.fadeIn();
				// Ta-da! It was there all along!
				$window.closed = false;
			}, 1000);
		});
	}

	// Handle toggle buttons
	$("button.toggle").on("click", (e) => {
		$(e.target).toggleClass("selected");
		$(e.target).attr("aria-pressed", $(e.target).hasClass("selected"));
	});
});
