export function join(...args: any): string {
    const parts   = [] as string[];
    const hasOwn  = {}.hasOwnProperty;
    for (let i = 0; i <  args.length; i++) {
        const type  = typeof args[i];
        const value = args[i];
        if (type === 'string' || type === 'number') {
            parts.push(value);
        } else if (Array.isArray(value) && value.length) {
            const inner = join(...(value as any));
            if (inner) {
                parts.push(inner);
            }
        } else if (type === 'object') {
            for (const key in value) {
                if (hasOwn.call(value, key) && value[key]) {
                    parts.push(key);
                }
            }
        }
    }
    return parts.join(' ');
}

export function props(...args: any) {
    let object = new Map()
    for (let i = 0; i < args.length; i++) {
        if (args.length > (i + 1)) {
            let k = args[i++]
            let v = args[i]
            object.set(k,v)
        }
    }
    return Object.fromEntries(object);
}