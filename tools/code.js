/**
 * Created by Ming Tse on 2016/8/17
 */
exports.aCode = aCode;

const min = 100000;
const max = 1000000;

function aCode() {
  return Math.floor(min + Math.random() * (max - min));
}