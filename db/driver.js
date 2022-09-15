const mongoose = require("mongoose");
const {Course,User} = require("./Model");

const lmsDBconnection= mongoose.connect("mongodb://localhost/lms");
lmsDBconnection 
.then(() => console.log("Connected to Mongo Database"))
.catch((err) => console.log("Error occurrred :- ", err));


// =========================================================
// Course test function
async function insertManyDataCourse_Test() {
	const courseData = [
		{
  name: "NodeJS",
  category: "Programming Languages",
  oneLiner: "Java",
  duration: "1",
  language: "Java",
  description: "java",
  lessons: [],

		},{
  name: "Perl",
  category: "Programming Languages",
  oneLiner: "perl",
  duration: "1",
  language: "Perl",
  description: "perl",
  lessons: [],

	},{
  name: "PHP",
  category: "Programming Languages",
  oneLiner: "PHP",
  duration: "2",
  language: "Perl",
  description: "perl",
  lessons: [],

	},{
  name: "Info Communication",
  category: "IT",
  oneLiner: "Info",
  duration: "2",
  language: "NA",
  description: "Info",
  lessons: [],

		},{
  name: "Tableua",
  category: "Analytics",
  oneLiner: "Analytics",
  duration: "3",
  language: "NA",
  description: "charting",
  lessons: [],

		},{
  name: "Excel",
  category: "Analytics",
  oneLiner: "Analytics",
  duration: "2",
  language: "NA",
  description: "Tools",
  lessons: [],

		},
	];
	Course.insertMany(courseData)
	.then((value) =>
				console.log("Course(s) data loaded for test ! :-  ", value)
			 )
			 .catch((err) => console.log(err));
}

// insertManyDataCourse_Test();

// =========================================================
// User test function
async function insertManyDataUser_Test() {
	const userData = [
		{
			name: "John Doe",
			type: 2,
			emailId: "john_doe@gmail.com",
			passwd: "john",

		},
		{
			name: "Alibaba ",
			type: 2,
			emailId: "alibaba@gmail.com",
			passwd: "alibaba",

		},{
			name: "Peter Pan",
			type: 2,
			emailId: "peter_pan@gmail.com",
			passwd: "peter_pan",

		},{
			name: "Ah Tan",
			type: 1,
			emailId: "ah_tan@gmail.com",
			passwd: "ah_tan",

		},{
			name: "Chen Chen",
			type: 1,
			emailId: "chen_chen@gmail.com",
			passwd: "chen_chen",

		},
	];

	User.insertMany(userData)
	.then((value) =>
				console.log("user(s) data loaded for test ! :-  ", value)
			 )
			 .catch((err) => console.log(err));

}

// insertManyDataUser_Test();

