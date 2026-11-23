const invisibleCharRegex = '[\\s\\p{C}\u034f\u17b4\u17b5\u2800\u115f\u1160\u3164\uffa0]';
const trimStartRegex = new RegExp('^' + invisibleCharRegex + '+', 'u');
const trimEndRegex = new RegExp(invisibleCharRegex + '$', 'u');

export function trimStart(str) {
  return str.replace(trimStartRegex, '');
}

export function trimEnd(str) {
  while (trimEndRegex.test(str)) {
    str = str.replace(trimEndRegex, '');
  }

  return str;
}

const ELLIPSIS = '...';
const graphemeSegmenter = new Intl.Segmenter();

export function truncate(str, maxLength) {
  if (typeof str !== 'string' || typeof maxLength !== 'number' || str.length <= maxLength || Number.isNaN(maxLength)) {
    return str;
  }

  maxLength = Math.floor(maxLength);

  if (maxLength <= 0) return '';

  const ellipsis = ELLIPSIS.slice(0, maxLength);
  const keep = maxLength - ellipsis.length;

  let count = 0;
  let cut = 0;

  for (const { index } of graphemeSegmenter.segment(str)) {
    if (count === keep) cut = index;

    if (count === maxLength) {
      return trimEnd(str.slice(0, cut)) + ellipsis;
    }

    count++;
  }

  return str;
}
