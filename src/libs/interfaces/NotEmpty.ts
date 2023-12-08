export type NotEmpty<T> = T &
    { [K in keyof T]-?: { [P in K]-?: T[K] } }[keyof T];
