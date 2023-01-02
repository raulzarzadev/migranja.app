export interface TypeBase {
  id: string
  createdAt: number | string
  updatedAt: number | string
  userId: string
}

export type DateType = number | Date

export type Merge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never
}
