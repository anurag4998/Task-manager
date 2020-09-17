function add(a, b) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(a + b);
        }, 2000);
    });
}

const dowork = async () => {

    let sum = await add(1, 2)
    return sum
}

console.log(add(1, 2).then(sum => console.log(sum)))
dowork().then((result) => console.log(result))
