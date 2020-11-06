/**
 * @param {*} from
 * @param {*} to
 * @return {Number}
 */
function randomIntFromTo(from, to) {
  const first = parseInt(from, 10);
  const second = parseInt(to, 10);
  if (!Number.isInteger(first) || !Number.isInteger(second)) throw new Error('Irregular input');
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

export default randomIntFromTo;
