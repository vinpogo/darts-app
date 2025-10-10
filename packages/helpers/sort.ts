export const ascending =
  <T = number>(getter: (el: T) => number) => (a: T, b: T): number =>
    getter(a) > getter(b) ? 1 : -1

export const descending =
  <T = number>(getter: (el: T) => number) => (a: T, b: T): number =>
    getter(a) > getter(b) ? -1 : 1
