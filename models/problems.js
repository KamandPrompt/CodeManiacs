var Problems = mongoose.Schema({
    
    qID: Integer,

    name: String,

    description: String,

    inputFormat: String,

    outputFormat: String,

    constraints: String,

    sampleInput: String,

    sampleOutput: String,

    explanation: String,

    difficulty: Integer,

    problemSetter: String,

    timeLimit: Integer,

    memoryLimit: Integer,

    tags: String,

    editorial: String,
});

export {Problems};












