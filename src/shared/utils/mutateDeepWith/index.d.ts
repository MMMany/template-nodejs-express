export type MutateCustomizer = (
  value: any,
  key: string,
  parent: any | undefined,
  obj: any,
  stack: string[],
) => any | void;

declare function mutateDeepWith<T extends object = any>(obj: T, customizer: MutateCustomizer): void;

export default mutateDeepWith;
