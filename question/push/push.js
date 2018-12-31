// Initialize Firebase
var config = {
	apiKey: "AIzaSyAGzg2lKl-mAFh_H_OZGOMG10IivR5xvzw",
	authDomain: "maniacdb-123.firebaseapp.com",
	databaseURL: "https://maniacdb-123.firebaseio.com",
	projectId: "maniacdb-123",
	storageBucket: "maniacdb-123.appspot.com",
	messagingSenderId: "710862225127"
};
firebase.initializeApp(config);

const submit = () => {

    //get elements
    const QuesName = document.getElementById("QuesName");
	const QuesID = document.getElementById("QuesID");
	const Description = document.getElementById("Description");
	const InputFormat = document.getElementById("InputFormat");
	const OutputFormat = document.getElementById("OutputFormat");
	const Constraints = document.getElementById("Constraints");
	const SampleInput = document.getElementById("SampleInput");
	const SampleOutput = document.getElementById("SampleOutput");
	const Explanation = document.getElementById("Explanation");
	const DifficultyLevel = document.getElementById("DifficultyLevel");
	const ProblemSetter = document.getElementById("ProblemSetter");
	const TimeLimit = document.getElementById("TimeLimit");
	const MemoryLimit = document.getElementById("MemoryLimit");
	const Tags = document.getElementById("Tags");
	const Editorial = document.getElementById("Editorial");

    // creating question object
    const ques = {};

	ques.Name = QuesName.value ;
	ques.Description = Description.value ;
	ques.InputFormat = InputFormat.value ;
	ques.OutputFormat = OutputFormat.value ;
	ques.Constraints = Constraints.value ;
	ques.SampleInput = SampleInput.value ;
	ques.SampleOutput = SampleOutput.value ;
	ques.Explanation = Explanation.value ;
	ques.Difficulty = DifficultyLevel.value ;
	ques.Setter = ProblemSetter.value ;
	ques.Time = TimeLimit.value ;
	ques.Memory = MemoryLimit.value ;
	ques.Tags = Tags.value ;
	ques.Editorial = Editorial.value ;

	//get reference of questions
	const dbRef = firebase.database().ref('questions');

	dbRef.child('Total').once('value').then(snap => {

		// get total num of problems and increment by one
		const ProbNum = parseInt(snap.val() ) + 1;
		dbRef.child('Total').set(ProbNum);

		dbRef.child(ProbNum).set(ques);

		window.alert("Question Submitted as "+ ProbNum );
		document.location.reload();
	});
	
}