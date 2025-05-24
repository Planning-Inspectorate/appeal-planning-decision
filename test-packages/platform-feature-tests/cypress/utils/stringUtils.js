
export class StringUtils {
    // @ts-ignore   
    generateLongString(longTextLength) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        const repeatCount = Math.ceil(longTextLength / characters.length);
        return characters.repeat(repeatCount).slice(0, longTextLength);
    }
}