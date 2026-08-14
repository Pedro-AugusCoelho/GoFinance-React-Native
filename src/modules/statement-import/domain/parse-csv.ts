export function parseCsv(content: string): string[][] {
    const text = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    const rows: string[][] = []
    let row: string[] = []
    let field = ''
    let inQuotes = false

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index]

        if (inQuotes) {
            if (char === '"') {
                if (text[index + 1] === '"') {
                    field += '"'
                    index += 1
                } else {
                    inQuotes = false
                }
            } else {
                field += char
            }
            continue
        }

        if (char === '"') {
            inQuotes = true
            continue
        }

        if (char === ',') {
            row.push(field)
            field = ''
            continue
        }

        if (char === '\n') {
            row.push(field)
            rows.push(row)
            row = []
            field = ''
            continue
        }

        field += char
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field)
        rows.push(row)
    }

    return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''))
}

export function normalizeHeader(cells: string[]): string[] {
    return cells.map((cell) => cell.trim().toLowerCase())
}
