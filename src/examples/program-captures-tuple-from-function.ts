export default {
    name: "Program captures tuple from function",
    text: 
`
function hello(): (uint64, uint64, uint64) {
    return (10, 20, 30);
}

const (a, b, c) = hello();
`
};