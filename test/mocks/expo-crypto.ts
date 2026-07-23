export const CryptoDigestAlgorithm = {
    SHA256: 'SHA-256',
} as const

export async function digestStringAsync(_algorithm: string, value: string): Promise<string> {
    return `sha256:${value}`
}
