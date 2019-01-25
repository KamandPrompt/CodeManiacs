var Testcases = mongoose.Schema ( {
    
    qID: Integer,

    timeLimit: Integer,

    memoryLimit: Integer,

    cases: [{stdin: String, stdout: String}]

});

export {Testcases};
