export const classifyPayload = (bytes: number) => {
    if (bytes < 500 * 1024) return { level: 'Low', color: '#53AB79' } // <500KB
    if (bytes < 2 * 1024 * 1024) return { level: 'Moderate', color: '#309BFF' } // <2MB
    return { level: 'High', color: '#E84855' } // >2MB
}

export const classifyDistance = (km: number) => {
    if (km < 1000) return { level: 'Short', color: '#53AB79' }
    if (km < 5000) return { level: 'Medium', color: '#309BFF' }
    return { level: 'Long', color: '#E84855' }
}

export const classifyCO2 = (grams: number) => {
    if (grams < 100) return { level: 'Low', color: '#53AB79' }
    if (grams < 1000) return { level: 'Moderate', color: '#309BFF' }
    return { level: 'High', color: '#E84855' }
}
