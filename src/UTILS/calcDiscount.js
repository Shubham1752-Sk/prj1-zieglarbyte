export default function calculateDiscount(price, discountedPrice){
    let percentage = ((discountedPrice - price)/price)*100;
    return Math.round(percentage)
}