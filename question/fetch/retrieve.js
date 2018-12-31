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

//getting the question ID from url
const url = window.location.href;
const qID = url.substring(url.lastIndexOf('qID=')+4)

//getting reference of the corresponding Questions
const databaseRef = firebase.database().ref('questions/'+qID);

databaseRef.once('value').then(snapshot => {
	
	const ques = snapshot.val()
	//Put code to display question here
	// Getting the elements

	const QuesName = document.getElementById("QuesName");
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

	// appending the ques data
	QuesName.innerHTML += ques.Name;
	Description.innerHTML += ques.Description;
	InputFormat.innerHTML += ques.InputFormat;
	OutputFormat.innerHTML += ques.OutputFormat;
	Constraints.innerHTML += ques.Constraints;
	SampleInput.innerHTML += ques.SampleInput;
	SampleOutput.innerHTML += ques.SampleOutput;
	Explanation.innerHTML += ques.Explanation;
	DifficultyLevel.innerHTML += ques.Difficulty;
	ProblemSetter.innerHTML += ques.Setter;
	TimeLimit.innerHTML += ques.Time;
	MemoryLimit.innerHTML += ques.Memory;
	Tags.innerHTML += ques.Tags;
	Editorial.innerHTML += ques.Editorial;
});
