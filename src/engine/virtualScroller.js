// src/engine/virtualScroller.js

/**
 * Custom row-recycling virtual scroller — no external libraries.
 * Maintains fixed DOM node count = visibleCount + buffer.
 * Swaps content of existing nodes on scroll (not create/destroy).
 */
export class VirtualScroller {
  constructor(options) {
    this.containerEl = options.container;
    this.rowHeight = options.rowHeight || 44;
    this.renderCallback = options.onRender;
    this.totalItems = 0;
    this.scrollTop = 0;
    this.visibleCount = 0;
    this.rafId = null;
    this._abortController = new AbortController();

    this._calculateVisible();
    this._bindEvents();
  }

  _calculateVisible() {
    this.visibleCount = Math.ceil(this.containerEl.clientHeight / this.rowHeight) + 10;
  }

  _bindEvents() {
    const { signal } = this._abortController;
    this.containerEl.addEventListener(
      'scroll',
      () => {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
          this.scrollTop = this.containerEl.scrollTop;
          const startIndex = Math.floor(this.scrollTop / this.rowHeight);
          const endIndex = Math.min(startIndex + this.visibleCount, this.totalItems);
          this.renderCallback(startIndex, endIndex, this.scrollTop);
        });
      },
      { passive: true, signal }
    );
  }

  update(totalItems) {
    this.totalItems = totalItems;
    const phantom = this.containerEl.querySelector('.vscroll-phantom');
    if (phantom) {
      phantom.style.height = `${totalItems * this.rowHeight}px`;
    }
  }

  recalculate() {
    this._calculateVisible();
    // Trigger an initial render
    const startIndex = Math.floor(this.scrollTop / this.rowHeight);
    const endIndex = Math.min(startIndex + this.visibleCount, this.totalItems);
    this.renderCallback(startIndex, endIndex, this.scrollTop);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this._abortController.abort();
  }
}
