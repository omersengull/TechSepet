

const priceClip = (value: string | number) => {
    const numberValue = typeof value === 'number' ? value : parseFloat(value);
    if (!isNaN(numberValue)) {
        return new Intl.NumberFormat('tr-TR').format(numberValue);
    }
    return value;
}


export default priceClip;
