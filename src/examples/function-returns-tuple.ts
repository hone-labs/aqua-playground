export default {
    name: "Function returns tuple",
    text: 
`
function hello(): (uint64, uint64, uint64) {
    return (10, 20, 30);
}

const (a, b, c) = hello();
`
};