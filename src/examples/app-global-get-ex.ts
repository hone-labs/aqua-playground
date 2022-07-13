export default {
    name: "app_global_get_ex",
    text: 
`
const (value, exists) = appGlobalGetEx(5, "my-global-variable");
if (exists) {
    return 1;
}
else {
    return 0;
}
`
};