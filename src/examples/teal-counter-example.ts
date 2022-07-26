export default {
    name: "Teal-counter example",
    text: 
`
const key = "counterValue";

//
// Contract creation
//
function creation(): void {
    appGlobalPut(key, btoi(txn.ApplicationArgs[0]));
}

//
// Increment the counter.
//
function incrementCounter(): void {
    let currentValue = appGlobalGet(key);
    currentValue = currentValue + 1;
    appGlobalPut(key, currentValue);
}

// 
// Decrement the counter.
//
function decrementCounter(): void {
    let currentValue = appGlobalGet(key);
    currentValue = currentValue - 1;
    appGlobalPut(key, currentValue);
}

if (txn.ApplicationID == 0) {
    creation();
    return 1;
}

if (txn.OnCompletion == OnComplete.NoOp) {

    //
    // Application call
    //

    if (txn.ApplicationArgs[0] == "increment") {
        incrementCounter();
        return 1; // Approval
    }

    if (txn.ApplicationArgs[0] == "decrement") {
        decrementCounter();
        return 1; // Approval
    }

    return 0; // Rejection
}

//
// By default, disallow updating or deleting app
//
if (txn.OnCompletion == OnComplete.UpdateApplication
    || txn.OnCompletion == OnComplete.DeleteApplication
    || txn.OnCompletion == OnComplete.CloseOut
    || txn.OnCompletion == OnComplete.DeleteApplication
    || txn.OnCompletion == OnComplete.OptIn) {
    
    return 0; // Rejection
}

return 0; // Rejection
`
};