function totalMojoConsumed(initialMojo){
    let eatenMojo=initialMojo;
    let mutkis= initialMojo;

while(mutkis>=3)
{
    const newMojos= Math.floor(mutkis/3);
    eatenMojo+=newMojos;
    mutkis=(mutkis%3)+newMojos;
}
return eatenMojo;
}
const result= totalMojoConsumed(10);
console.log(`Total Consumed Mojo = ${result}`);