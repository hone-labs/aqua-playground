export default {
    name: "First example",
    text: 
`
function onRegister(): uint64 {
    return 1;
}

function main(): uint64 {
    return onRegister();
}

return main();
`
};