export type StringKey<T, K extends PropertyKey = keyof T> 
= K extends string ? K : never

export type StringKeyValue<T, K extends string> 
= T extends Record<K, infer V> ? V : never

export type KeyValue<T, K extends PropertyKey = keyof T> 
= T extends Record<K, infer V> ? V : never