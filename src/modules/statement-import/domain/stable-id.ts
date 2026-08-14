function fnv1a(input: string, seed: number): number {
    let hash = seed

    for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index)
        hash = Math.imul(hash, 16777619)
    }

    return hash >>> 0
}

export function createStableExternalId(parts: string[]): string {
    const input = parts.join('|').normalize('NFC').trim().toLowerCase()
    const left = fnv1a(input, 2166136261).toString(16).padStart(8, '0')
    const right = fnv1a(input, 0x811c9dc5).toString(16).padStart(8, '0')

    return `${left}${right}`
}
