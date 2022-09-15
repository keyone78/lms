const express = require('express'); //Import the express dependency
const app= express();              //Instantiate an express app, the main work horse of this server
const router= express.Router(); 

const bodyParser = require('body-parser');
const joi = require("@hapi/joi")

const multer = require("multer");
// =========================================================
// db
// =========================================================
const mongoose = require("mongoose");
const {Course,User,insertNewUser, insertNewCourse} = require("./db/Model");
const lmsDBconnection= mongoose.connect("mongodb://localhost/lms");
lmsDBconnection 
.then(() => console.log("Connected to Mongo Database"))
.catch((err) => console.log("Error occurrred :- ", err));

// =========================================================
//Configuration for Multer
// =========================================================
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "api");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `uploads/admin-${file.fieldname}-${Date.now()}.${ext}`);
	},
});

// Multer Filter
const multerFilter = (req, file, cb) => {
	// mimetype: 'text/plain'
	console.log("Result :-", file.mimetype.split("/"));
	if (file.mimetype.split("/")[0] === "image") {
		cb(null, true);
	} else {
		cb(new Error("Not a image File!!"), false);
	}
};
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

// =========================================================

// View engine setup
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', (req, res) => {
	console.log("Result :- / start ");
	res.render('register',{err_msg_signup:'', err_msg:''} );
});

var curr_user={};
var sys_msg={msg:''};
var course_ary=[];

///=========================================================
// Register
///=========================================================
// post  from main signup
router.post('/api/register',async (req, res) => {        

	console.log('in sign up');
	const schema = joi.object({
		email: joi.string().min(1).required(),
		fullname: joi.string().min(1).required(),
		passwd: joi.string().min(1).required(),
		passwd_c: joi.string().min(1).required(),
		login_type: joi.string().min(1).required(),
	});

	const v_result =schema.validate(req.body);
	if (v_result.error){
		console.log("login signup :-", v_result.error.details[0].message);
		const errorMsg=v_result.error.details[0].message;
		res.render('register',{err_msg_signup:errorMsg, err_msg:''} );

	}

	if (req.body.passwd_c != req.body.passwd) {
		console.log('check passwd');
		res.render('register', { err_msg_signup: ' Password incorrect! ' } );
	}
	const user = await User.find( { "emailId": req.body.email } );
	console.log("get user :-",user);
	if (user.length === 0) {

		insertNewUser(req);

		const user =await User.find( { "emailId": req.body.email } );

		res.render('content',{ sys_username: user.name} );

	}else if (user[0].emailId === req.body.email) {
		res.render('index',{err_msg_signup:"The email ID had been taken!", err_msg:''} );
	}else{

		console.log("Result :- new user added goto content page");

		curr_user = await User.find( { "emailId": req.body.email } );
		res.render('content',{sys_username:curr_user.name} );
	}
});


///=========================================================
// login
///=========================================================
router.post('/api/login',async (req, res) => {        

	const schema = joi.object({
		email: joi.string().min(1).required(),
		passwd: joi.string().min(1).required(),
	});
	const v_result =schema.validate(req.body);
	if (v_result.error){
		const errorMsg=v_result.error.details[0].message;
		res.render('register',{err_msg_signup:'', err_msg:errorMsg} );
	}else{

		try {
			const userA = await User.find( { "emailId": req.body.email } );

			if (userA.length === 0 ) {
				res.render('register',{err_msg_signup:'', err_msg:'Invalid Email ID'} );
			}else if ( userA[0].passwd != req.body.passwd) {

				res.render('register',{err_msg_signup:'', err_msg:'Password Incorrect!'} );
			}
			else{

				curr_user =userA; 
				console.log("Result :- valid user ");
				res.render('content',{sys_username:userA[0].name} );
			}
		}catch(err){
			res.send(err);
		}
	}
});
// =========================================================
// main page
// =========================================================

router.get('/api/content', (req, res) => {        

	let	userName='';
	if (typeof curr_user[0] == 'undefined' ){
		userName='';
	}else{

		userName=curr_user[0].name;
	}
	res.render('content' ,{ sys_username:userName });

});
// =========================================================
// create course 
// =========================================================

router.get('/api/createcourse', (req, res) => {        
	console.log("In  iii createcourse",sys_msg);
	res.render('createcourse',{ tagline: "" });
});

router.post("/api/createcourse",upload.single("files"), async (req,res)=>{
	console.log(' in body');


	await	insertNewCourse(req);

	console.log("Result :- insserted" );
	res.render('createcourse',{ tagline: "Successfully create new course " });

	console.log("Result :- insserted1231");
});

// =========================================================
// Update course
// =========================================================
router.get('/api/updatecourse', (req, res) => {        
	// let c=Course.find({});
	console.log("In updatecourse -- GET");
	Course.find({}, function(err, course) {
		var courseMap = {};

		course.forEach(function(course) {
			courseMap[course._id] = course;
		});
		course_ary=course;
		res.render('updatecourse',{ variables:course, out_category:'' , out_load:'-',
							 out_one_liner:'',
							 out_language :'',
							 out_description:'',
							 out_duration:'',
							 out_course_img:'',
							 out_course_id:'',
		} );
	});

});

// update
router.post('/api/updatecourse/:id', async (req, res) => {       
	// console.log("In updatecourse load ", req.body);
	//find the object by id
	const course  = await Course.findById(req.params.id );
	course.set({
		oneLiner:    req.body.one_liner,
		duration_hr: req.body.duration_hr,
		category:    req.body.category,
		language:    req.body.language,
		description: req.body.description,
	});
	// save data
	const result = await course.save();
	// console.log("Course updated :- data save");

	res.redirect('/api/updatecourse');
});

router.post('/api/updatecourse', async (req, res) => {       
	console.log("In updatecourse load ", req.body);
	// load the courses after selection
	if (req.body.sel_course !='-') {
		const t_course = await Course.find( { "name": req.body.sel_course} );
		// console.log("Resul  ooo ", t_course);
		// return res.redirect('/updatecourse');
		res.render('updatecourse',{ variables:course_ary, out_category: t_course[0].category,
							 out_load: t_course[0].name,
							 out_one_liner:t_course[0].oneLiner,
							 out_duration:t_course[0].duration_hr,
							 out_language:t_course[0].language,
							 out_description:t_course[0].description,
							 out_course_img:"./uploads/"+ t_course[0].photo,
							 out_course_id:t_course[0]._id,
		});
	}

});

// =========================================================
// Delete course
// =========================================================
router.get('/api/deletecourse', (req, res) => {        
	console.log("In deletecourse", curr_user);
	// student cannot delete course
	// res.render('deletecourse', {error_delete:'No permission to delete course!'} );
	Course.find({}, function(err, course) {
		var courseMap = {};

		course.forEach(function(course) {
			courseMap[course._id] = course;
		});
		course_ary=course;
		console.log("Result :-", course);
		res.render('deletecourse',{ c_course:course, out_category:'' ,
							 out_load:'-',
							 out_one_liner:'',
							 out_language :'',
							 out_description:'',
							 out_duration:'',
							 out_course_img:'',
							 error_delete:'',
		} );
	});
});
router.post('/api/delete/:id', async (req, res) => {        
	await Course.deleteOne({_id: req.params.id})
	// back to deletecourse
	return res.redirect('/api/deletecourse');
});

var errmsg_passwd='';

router.get('/api/edituser', (req, res) => {        

	console.log("In  edituser", curr_user[0]);
	// curr_user =userA;
	console.log("In edituser");
	if  (typeof curr_user[0] ==='undefined' ) {
		res.redirect('content');


	}else{
		res.render('edituser', {
			user_name:curr_user[0].name, 
			user_email:curr_user[0].emailId, 
			err_msg:'',
			err_msg_passwd:'',
			_id:curr_user[0]._id,

		});

	}
});

router.post('/api/change_pswd/:id',async (req, res) => {        

	console.log("In  change pass",req.body);
	if ( req.body.passwd != req.body.passwd_c ) {

		res.render('edituser' ,{
			user_name:curr_user[0].name, 
			user_email:curr_user[0].emailId, 
			err_msg:'',
			err_msg_passwd:'Pass word not match!',
			_id:curr_user[0]._id,

		});
	}else {
		const user= await User.findById(req.params.id );
		curr_user = user;
		console.log("In  change pass",user);
		user.set({
			passwd: req.body.passwd_c
		});

		const result = await user.save();
		res.redirect('../edituser');


	}

});


module.exports = router;
