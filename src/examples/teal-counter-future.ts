export default {
    name: "Teal-counter (in the future, maybe?)",
    text: 
`
contract TealCounter {

    counterValue: uint64;

    private onCreate(): uint64 { // Private method, only callable by the creator.
        counterValue = btoi(txn.ApplicationArgs[0]);
        return 1;
    }

    public onIncrementCounter(): uint64 { // Public methods are callable by anoyone.
        counterValue = counterValue + 1;
        return 1;
    }

    public onDecrementCounter(): uint64 {
        counterValue = counterValue - 1;
        return 1;
    }
};
`
};