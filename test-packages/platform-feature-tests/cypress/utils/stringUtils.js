
export class StringUtils{    
    // @ts-ignore
    //const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    

   //const genString = "dfldjfj fdjljfldsajfldj ljflds;fifpi0w4u0mlds 0reuonf dw0f uew0jewonro ejc"
    generateLongString(longTextLength){
        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        const repeatCount = Math.ceil(longTextLength/characters.length);
        return characters.repeat(repeatCount).slice(0,longTextLength);        
    }
}