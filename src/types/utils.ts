export type StringKey<T, K extends PropertyKey = keyof T> 
= K extends string ? K : never

export type StringKeyValue<T, K extends string> 
= T extends Record<K, infer V> ? V : never

export type KeyValue<T, K extends PropertyKey = keyof T> 
= T extends Record<K, infer V> ? V : never

// 将指定键设置为可选
export type PartialKey<T, K extends keyof T> = 
  Partial<Pick<T, K>> & Omit<T, K>

export type OmitKeyMerge<T, K extends keyof T, U extends Partial<T> & Record<PropertyKey, any>> = 
  T | 
  (U extends Record<PropertyKey, unknown> 
    ? (Omit<T, K> & U)
    : never)