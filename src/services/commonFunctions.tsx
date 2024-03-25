export const isBothObjectSame = (obj1, obj2) => {
    if (typeof obj1 === "object" && typeof obj2 === "object") {
        return Object.values(obj1).join('') === Object.values(obj2).join('')
    }
    return false
}