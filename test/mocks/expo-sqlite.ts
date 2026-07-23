export async function openDatabaseAsync(): Promise<never> {
    throw new Error('expo-sqlite is not available in unit tests')
}
