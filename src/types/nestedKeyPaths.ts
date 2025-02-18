export type NestedKeyPaths<T> = T extends object
    ? {
          [Key in keyof T]: Key extends string | number
              ? `${Key}${NestedKeyPaths<T[Key]> extends never ? "" : `.${NestedKeyPaths<T[Key]>}`}`
              : never;
      }[keyof T]
    : never;
