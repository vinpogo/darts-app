export const splitArray = <T>(
  arr: T[],
  predicate: (arg: T) => boolean,
): [T[], T[]] => {
  const trues: T[] = []
  const falses: T[] = []
  for (const el of arr) {
    if (predicate(el)) trues.push(el)
    else falses.push(el)
  }
  return [trues, falses]
}
