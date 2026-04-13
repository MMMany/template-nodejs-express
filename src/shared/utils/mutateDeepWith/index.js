/**
 * @typedef {import('./index.js').MutateCustomizer} MutateCustomizer
 */

/**
 * 원본 객체를 깊게 순회하며 커스터마이저의 조건에 따라 직접 수정(Mutable)하는 함수
 * @template {object} T
 * @param {T} obj 원본 루트 객체
 * @param {MutateCustomizer} customizer 변환 로직을 담은 콜백 함수
 * @returns {void}
 */
function mutateDeepWith(obj, customizer) {
  if (!isTraversable(obj)) return;
  if (!customizer) return;

  /**
   * @param {object | Array} currentTarget
   * @param {string[]} currentStack
   */
  function walk(currentTarget, currentStack) {
    const keys = Object.keys(currentTarget);

    for (const key of keys) {
      const value = currentTarget[key];

      const newValue = customizer(value, key, currentTarget, obj, currentStack);

      if (newValue !== undefined) {
        currentTarget[key] = newValue;
      } else if (isTraversable(value)) {
        walk(value, [...currentStack, key]);
      }
    }
  }

  walk(obj, []);
}

/**
 * 값이 순회 가능한 배열인지 순수 객체(Plain Object)인지 확인
 * @param {any} value
 * @returns {boolean}
 */
function isTraversable(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // is it array? -> OK
  if (Array.isArray(value)) {
    return true;
  }

  // is it plain-object? -> OK
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

export default mutateDeepWith;
