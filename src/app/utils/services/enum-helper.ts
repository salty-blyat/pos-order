export interface EnumConverter {
  key?: number;
  value?: any;
}

export class EnumHelpers {
  static ToArray(type: any): EnumConverter[] {
    const types: EnumConverter[] = [];
    Object.entries(type)
      .filter((e) => !isNaN(e[0] as any))
      .map((e) => ({ value: e[1], key: e[0] }))
      .forEach((item) => types.push({ key: +item.key, value: item.value }));
    return types;
  }

  static toArrayString(type: any): { key: string; value: any }[] {
    const types: { key: string; value: any }[] = [];
    Object.entries(type)
      .map((e) => ({ value: e[1], key: e[0] }))
      .forEach((item) => types.push({ key: item.key, value: item.value }));
    return types;
  }
}
