export default {
    name: "Contract methods example",
    text: 
`

function onCreation(): uint64 {
    // ...
    return 1;
}

function onMethod1(): uint64 {
    // ...
    return 1;
}

function onMethod2(): uint64 {
    // ...
    return 1;
}

function main(): uint64 {
    if (txn.ApplicationID == 0) {
        return onCreation();
    }
    else if (txn.ApplicationArgs[0] == "method1") { 
        return onMethod1();
    }
    else if (txn.ApplicationArgs[0] == "method2") { 
        return onMethod2();
    }
    
    return 0; // Rejection
}

return main();
`
};