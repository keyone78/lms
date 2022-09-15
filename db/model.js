const mongoose = require("mongoose");

// course
const courseSchema = new mongoose.Schema({
	$oid: String,
  name: String,
  category: String,
  oneLiner: String,
  duration_hr: String,
  language: String,
  description: String,
  lessons: [],
	photo:String,
  date: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", courseSchema);

// user 
const usersSchema= new mongoose.Schema({
  $oid: String,
  name: String,
  type: String,
  emailId: String,
  passwd: String,
  date: { type: Date, default: Date.now },
});
const User= mongoose.model("User", usersSchema);
// ====================================================
// insert new course 
// ====================================================
const insertNewCourse= async function insertOneCourse (req) {                 
	// default filename is empty
	let filename=req.file.filename;
	const courseone= new Course({               
		name: req.body.course_name,                   
		category : req.body.category,
		oneLiner : req.body.one_liner,
		language :req.body.language,
		duration_hr:req.body.duration_hr,
		lessons:[],
		description:req.body.description,
		photo: filename

	});                                          
	Course.create(courseone);
}

// insert new user
const insertNewUser = async function insertOneUser(req) {                 

	const userOne = new User({               
		name: req.body.fullname,                   
		type: ((req.body.login_type === 'instructor' )? 1: 2),
		emailId:req.body.email,
		passwd:req.body.passwd
	});                                          
	User.create(userOne)
	.then((value) => console.log("New user Saved Successfully! :-  ")

	)
	.catch((err) => console.log(err));
}

module.exports = {
	Course,
	User,
	insertNewUser,
	insertNewCourse
};

