export default {
    name: "This function shouldn't compile",
    text: 
`
function hello(x): (uint64, uint64, uint64) {
    if (x > 5) {
        return (10, 20, 30); 
    }
    else {
        return (10, 20, 30, 40); // Shouldn't be allowed!
    }
}

hello(3);
`
};