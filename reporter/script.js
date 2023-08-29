'use strict';

document.addEventListener('DOMContentLoaded', function() {
	function $sel(el) {
		return document.querySelector(el);
	}
	function $all(el) {
		return document.querySelectorAll(el);
	}

	function count(el) {
		return el.length;
	}

	function mountCount(el, button) {
		const label = button.textContent;
		button.innerHTML = `${label} <small>${count(el)}</small>`;
	}

	function searchScenarios() {
		const divsAll = $all('.card');
		const labels = $all('.card > .card-label');
		const inputSearch = $sel('.header-container-search-input > input');

		function initSearchInput(
			inputSelector,
			divRoot,
			labelsTexts,
			classHide,
			inputLength
		) {
			inputSelector.addEventListener('input', event => {
				if (event.target.value.length >= inputLength) {
					labelsTexts.forEach(label => {
						const textInput = event.target.value;
						const labelText = label.innerText
							.replace('Página: ', '')
							.split('|')[0]
							.trim();
						const textInputMatchTextLabel = labelText
							.toLowerCase()
							.includes(textInput.toLowerCase());
						const matchDivIsHide = $sel(
							`[data-label="${labelText}"]`
						).classList.contains(classHide);
						if (textInputMatchTextLabel) {
							if (matchDivIsHide) {
								$sel(`[data-label="${labelText}"]`).classList.toggle(classHide);
							}
						} else {
							if (!matchDivIsHide) {
								$sel(`[data-label="${labelText}"]`).classList.toggle(classHide);
							}
						}
					});
				} else {
					divRoot.forEach(div => {
						div.classList.remove(classHide);
					});
				}
			});
		}
		initSearchInput(inputSearch, divsAll, labels, 'hide', 3);
	}

	function initModalWithImageSliderCompare() {
		const modals = $all('.modal');
		const btnTest = $all('.card-content-column.test');

		modals.forEach(element => {
			let view = new ImageCompare(element, {
				fluidMode: true
			}).mount();
		});

		btnTest.forEach((item, i) => {
			item.addEventListener('click', () =>
				$sel(`#modal-${i}`).classList.remove('hide')
			);
		});

		$all('div[id^=\'modal\'] > .close').forEach((item, i) => {
			item.addEventListener('click', () =>
				$sel(`#modal-${i}`).classList.add('hide')
			);
		});
	}

	function filteringByBreakpointAndStatus() {
		const phone = $all('[data-scenario=\'phone\']');
		const tablet = $all('[data-scenario=\'tablet\']');
		const desktop = $all('[data-scenario=\'desktop\']');
		const reproved = [...phone, ...tablet, ...desktop].filter(
			tgt => parseInt(tgt.dataset.compatibility) <= 90
		);
		const passed = [...phone, ...tablet, ...desktop].filter(
			tgt => parseInt(tgt.dataset.compatibility) >= 90
		);
		const differentSize = [...phone, ...tablet, ...desktop].filter(
			tgt => tgt.dataset.compatibility.length <= 0
		);
		const btnPhone = $sel('.phone');
		const btnTablet = $sel('.tablet');
		const btnDesktop = $sel('.desktop');
		const btnAll = $sel('.all');
		const btnReproved = $sel('.reproved');
		const btnPassed = $sel('.passed');
		const btnWrongSizes = $sel('.sizes');
		const buttons = [btnPhone, btnTablet, btnDesktop];

		const toggleVisibilityByReport = (btn, itemsToHide, itemsToShow) => {
			btn.addEventListener('click', () => {
				itemsToHide.forEach(scenario => {
					scenario.classList.add('hide');
				});

				itemsToShow.forEach(scenario => {
					scenario.classList.remove('hide');
				});
			});
		};

		function filterScenarios(button, scn, tgt) {
			if (button.classList.contains(scn)) {
				tgt.forEach(scenario => {
					if (scenario.dataset.scenario === scn) {
						if (scenario.classList.contains('hide')) {
							scenario.classList.toggle('hide');
						}
					} else {
						if (!scenario.classList.contains('hide')) {
							scenario.classList.toggle('hide');
						}
					}
				});
			}
		}

		function mountMenuWithCountAndFilters() {
			mountCount(phone, btnPhone);
			mountCount(tablet, btnTablet);
			mountCount(desktop, btnDesktop);
			mountCount(reproved, btnReproved);
			mountCount(passed, btnPassed);
			mountCount(differentSize, btnWrongSizes);
			mountCount([...phone, ...tablet, ...desktop], btnAll);

			toggleVisibilityByReport(btnAll, [], [...phone, ...tablet, ...desktop]);

			toggleVisibilityByReport(
				btnReproved,
				[...passed, ...differentSize],
				reproved
			);

			toggleVisibilityByReport(
				btnPassed,
				[...reproved, ...differentSize],
				passed
			);

			toggleVisibilityByReport(
				btnWrongSizes,
				[...passed, ...reproved, ...differentSize],
				differentSize
			);

			buttons.forEach(button => {
				button.addEventListener('click', () => {
					['phone', 'tablet', 'desktop'].forEach(breakpoint => {
						filterScenarios(button, breakpoint, [
							...phone,
							...tablet,
							...desktop
						]);
					});
				});
			});
		}
		mountMenuWithCountAndFilters();
	}

	initModalWithImageSliderCompare();
	filteringByBreakpointAndStatus();
	searchScenarios();
});
