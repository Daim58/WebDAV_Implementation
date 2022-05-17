export type Nullable<T>      = T | null
export type Optional<T>      = Nullable<T> | undefined
export type NullableBoolean  = Nullable<boolean>
export type OptionalBoolean  = Optional<boolean>
export type NullableString   = Nullable<string>
export type OptionalString   = Optional<string>
export type NullableNumber   = Nullable<number>
export type OptionalNumber   = Optional<number>
export type NullableArray<T> = Array<T> | null
export type OptionalArray<T> = NullableArray<T> | undefined

export function Safe<T>(handler: () => T, def: T) : T {
    try {
        return handler()
    } catch (e) {
        return def
    }
}

export function NumberOR(n: OptionalNumber, def: number = 0): number {
    try {
        if (n) {
            return n
        }
    } catch (e) {
        // Do Nothing
    }
    return def
}

export function StringOR(s: OptionalString, def: string = ""): string {
    try {
        if (s) {
            return s
        }
    } catch (e) {
        // Do Nothing
    }
    return ""
}

export function BoolOR(b: OptionalBoolean): boolean {
    try {
        if (b) {
            return b
        }
    } catch (e) {
        // Do Nothing
    }
    return false
}

export function OK<T>(obj: Optional<T>): boolean {
    return null !== obj && undefined !== obj
}