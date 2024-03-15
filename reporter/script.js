class ReportUI {
  constructor() {
    this.initModalWithImageSliderCompare();
    this.filteringByBreakpointAndStatus();
    this.searchScenarios();
  }

  select(selector) {
    return document.querySelector(selector);
  }

  selectAll(selector) {
    return document.querySelectorAll(selector);
  }

  count(elements) {
    return elements.length;
  }

  mountCount(elements, buttonSelector) {
    const button = this.select(buttonSelector);
    if (button) {
      const label = button.textContent.split(' ')[0];
      button.innerHTML = `${label} <small>${this.count(elements)}</small>`;
    }
  }

  toggleVisibility(elements, shouldShow) {
    elements.forEach((element) => {
      element.classList.toggle('hide', !shouldShow);
    });
  }

  searchScenarios() {
    const input = this.select('.header-container-search-input > input');
    input.addEventListener('input', (event) => {
      const searchValue = event.target.value.toLowerCase();
      const cards = this.selectAll('.card');
      cards.forEach((card) => {
        const label = card
          .querySelector('.card-label')
          .textContent.toLowerCase();
        card.classList.toggle('hide', !label.includes(searchValue));
      });
    });
  }

  initModalWithImageSliderCompare() {
    const modals = this.selectAll('.modal');
    const btnTest = this.selectAll('.card-content-column.test');

    modals.forEach((modal) => {
      new ImageCompare(modal, { fluidMode: true }).mount();
    });

    btnTest.forEach((btn, index) => {
      btn.addEventListener('click', () =>
        this.select(`#modal-${index}`).classList.remove('hide')
      );
    });

    this.selectAll('div[id^="modal"] .close').forEach((btn, index) => {
      btn.addEventListener('click', () =>
        this.select(`#modal-${index}`).classList.add('hide')
      );
    });
  }

  filteringByBreakpointAndStatus() {
    const scenarios = [
      'phone',
      'tablet',
      'desktop',
      'passed',
      'reproved',
      'sizes',
      'all',
    ];
    const cards = this.selectAll('.card');

    scenarios.forEach((scenario) => {
      const btn = this.select(`.${scenario}`);
      if (!btn) return;

      btn.addEventListener('click', () => {
        const filterFunc = this.filterFunctions[scenario];
        cards.forEach((card) => {
          const shouldBeVisible = filterFunc ? filterFunc(card) : true;
          card.classList.toggle('hide', !shouldBeVisible);
        });
      });
    });

    this.updateButtonCounts();
  }

  get filterFunctions() {
    return {
      phone: (card) => card.dataset.scenario === 'phone',
      tablet: (card) => card.dataset.scenario === 'tablet',
      desktop: (card) => card.dataset.scenario === 'desktop',
      passed: (card) => parseFloat(card.dataset.compatibility) >= 90,
      reproved: (card) =>
        parseFloat(card.dataset.compatibility) < 90 &&
        card.dataset.compatibility !== '',
      sizes: (card) => card.dataset.compatibility === '',
      all: () => true,
    };
  }

  updateButtonCounts() {
    const cards = this.selectAll('.card');
    [
      'phone',
      'tablet',
      'desktop',
      'passed',
      'reproved',
      'sizes',
      'all',
    ].forEach((scenario) => {
      const filterFunc = this.filterFunctions[scenario];
      const count = Array.from(cards).filter(filterFunc).length;
      this.mountCount(Array.from(cards).filter(filterFunc), `.${scenario}`);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new ReportUI());
