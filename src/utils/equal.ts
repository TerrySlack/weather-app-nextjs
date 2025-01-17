export const isEqual = (a: unknown, b: unknown): boolean => {
  // Check for NaN
  if (typeof a === "number" && isNaN(a)) {
    return typeof b === "number" && isNaN(b);
  }

  // Check for different types
  if (typeof a !== typeof b) {
    return false; // Types are different
  }

  // Check for non-object types
  if (typeof a !== "object" || a === null) {
    return a === b; // For non-object types, perform simple comparison
  }

  // Check for Date objects
  if (a instanceof Date && b instanceof Date) {
    const epsilon = 1e-6; // 1 microsecond
    return Math.abs(a.getTime() - b.getTime()) < epsilon;
  }

  // Check for Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false; // Arrays have different lengths
    }
    let i = 0;
    while (i < a.length) {
      if (!isEqual(a[i], b[i])) {
        return false; // Array elements are different
      }
      i += 1;
    }

    return true; // All array elements are equal
  }

  // Check for Typed Arrays
  if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
    const uint8A = new Uint8Array(a.buffer);
    const uint8B = new Uint8Array(b.buffer);
    if (uint8A.length !== uint8B.length) {
      return false;
    }
    for (let i = 0; i < uint8A.length; i++) {
      if (uint8A[i] !== uint8B[i]) {
        return false;
      }
    }
    return true;
  }
  // Check for objects with circular references
  const seen = new WeakSet();
  if (
    typeof a === "object" &&
    a !== null &&
    typeof b === "object" &&
    b !== null
  ) {
    if (seen.has(a) && seen.has(b)) {
      return true;
    }
  }
  if (typeof a === "object" && a !== null) {
    seen.add(a);
  }
  if (typeof b === "object" && b !== null) {
    seen.add(b);
  }

  // Compare objects
  const objA = a as Record<string | number, unknown>;
  const objB = b as Record<string | number, unknown>;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false; // Objects have different number of keys
  }

  let j = 0;
  while (j < keysA.length) {
    const key = keysA[j];
    if (!keysB.includes(key) || !isEqual(objA[key], objB[key])) {
      return false; // Keys are different or their values are not equal
    }
    j += 1;
  }

  return true; // All keys and their values are equal
};
