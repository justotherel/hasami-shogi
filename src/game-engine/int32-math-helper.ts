export function toInteger(x: number) {
  x = Number(x);
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

export function modulo(a: number, b: number) {
  return a - Math.floor(a / b) * b;
}

export function toUint32(x: number) {
  return modulo(toInteger(x), Math.pow(2, 32));
}

export function toInt32(x: number) {
  const uint32 = toUint32(x);
  if (uint32 >= Math.pow(2, 31)) {
    return uint32 - Math.pow(2, 32);
  } else {
    return uint32;
  }
}

export function dec2bin(dec: number) {
  return (dec >>> 0).toString(2);
}
