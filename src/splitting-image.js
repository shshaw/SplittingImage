/**
 * # SplittingImage
 *
 * @param {*} els
 */
function SplittingImage(els, opts) {
  opts = opts || {};

  return $(els).map(function(el, i) {
    if (!el._splitImg) {
      el._splitImg = split(el, opts);
      if (el.classList) {
        el.classList.add("splitting-image");
      }
    }
    return el._splitImg;
  });
}

/**
 * # SplittingImage.$
 * Convert selector or NodeList to array for easier manipulation.
 *
 * @param {*} els - Elements or selector
 */
function $(els) {
  return Array.prototype.slice.call(
    els.nodeName
      ? [els]
      : els[0].nodeName ? els : document.querySelectorAll(els),
    0
  );
}
SplittingImage.$ = $;

/**
 * # SplittingImage.split
 * Split an element with the specified number of rows & cols
 * @param {Node} el - Element to split
 * @param {String} key -
 * @param {String|RegEx} splitBy - string or regex to split the innerText by
 * @param {Boolean} space - Add a space to each split if index is greater than 0. Mainly for `Splitting.words`
 */
function split(el, opts) {
  var img =
      opts.image || (el.dataset && el.dataset.image) || el.currentSrc || el.src,
    rows = opts.rows || (el.dataset && el.dataset.rows) || 1,
    cols = opts.cols || (el.dataset && el.dataset.cols) || 1,
    row = 0,
    col = 0,
    cells = [],
    parent = el.parentNode,
    cell,
    inner,
    temp;

  // Use fragment to prevent unnecessary DOM thrashing.
  var fragment = document.createDocumentFragment();

  for (; row < rows; row++) {
    for (col = 0; col < cols; col++) {
      // Create a span
      cell = document.createElement("span");
      cell.className = "split-cell";
      cell.style.setProperty("--row-index", row);
      cell.style.setProperty("--col-index", col);
      cell.style.setProperty("--cell-index", cells.length);
      cell.setAttribute("data-row", row);
      cell.setAttribute("data-col", col);

      inner = document.createElement("span");
      inner.className = "split-cell__inner";
      cell.appendChild(inner);

      fragment.appendChild(cell);
      cells.push(cell);
    }
  }

  if (!img) {
    img = el.querySelector("img");
    img = img && (img.currentSrc || img.src);
  }

  if (img) {
    el.style.setProperty("background-image", "url(" + img + ")");
  }

  el.style.setProperty("--row-total", rows);
  el.style.setProperty("--col-total", cols);
  el.style.setProperty("--cell-total", cells.length);

  // Append elements back into the parent
  el.appendChild(fragment);

  return {
    el: el,
    cells: cells,
    rows: rows,
    cols: cols
  };
}
SplittingImage.split = split;

SplittingImage.rows = function(els, rows, opts) {
  opts = Object.assign({}, opts, { cols: 1, rows: rows });
  return SplittingImage(els, opts);
};

SplittingImage.cols = function(els, cols, opts) {
  opts = Object.assign({}, opts, { rows: 1, cols: cols });
  return SplittingImage(els, opts);
};

export default SplittingImage;
