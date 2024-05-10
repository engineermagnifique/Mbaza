const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const cors=require('cors');
const nodemailer=require('nodemailer')
const {google}=require('googleapis')
const { redirect } = require('react-router-dom')
const socketIo=require('socket.io')
const http=require('http')
const { type } = require('os')


const app=express()
const server=http.createServer(app)
const io=require('socket.io')(server,{
    cors:{
        orgin:'http://localhost:3000',
        methods:['GET','POST'],
    }
})
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use(cors({
    orgin:'http://localhost:3000',
    methods:['GET','POST'],
    allowedHeaders:['Content-Type', 'Authorization'],
    credentials:true
}))

const port=process.env.PORT || 5000;

const corsOptions = {
    allowedHeaders: ['Content-Type', 'x-user-email'],
  };

  app.use(cors(corsOptions));

  const OAuth2=google.auth.OAuth2;
const oauth2Client=new OAuth2(
    '43715925189-8bi59lq2d90apssvlm6uj41s1sv2imlp.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground'
)

oauth2Client.setCredentials({
    refresh_token:'1//04N9SEw5J9luyCgYIARAAGAQSNwF-L9IrzS1qzflxAs3lHxxl1KKAw36Dgo85rUCTnzzUN0slRd9-PPl5oZMB-fanN9sbRyLQvJg'
});

const password = process.env.MONGODB_PASSWORD; 

mongoose.connect(`mongodb+srv://engineermaque:qkXAa1DKrs668MGT@cluster0.d0bzgaa.mongodb.net/onlineexams`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


const ExamUsers=new mongoose.Schema({

    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    rememberMe:{
        type:String,
        required:true,
    },
    RegistationInfo:[]
});

mongoose.model('ExamUsers',ExamUsers);
const Users=mongoose.model('ExamUsers');

app.post('/register', async (req,res)=>{
    const {fullname,email,password,confirmPassword,rememberMe}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const hashedPassword1=await bcrypt.hash(confirmPassword,10);

    const OldUsers=await Users.findOne({email})

    if(OldUsers)
    {
        return res.status(400).send({message:'Usanzwe uri muri sisiteme'});
    }
    if(password!==confirmPassword)
    {
        return res.status(400).send({message:'Password ntago zihura'});
    }
    if(password<6 || confirmPassword<6)
    {
        return res.status(400).send({message:'Password must greater than six'});
    }
    try {
    await Users.create({
        fullname,
        email,
        password:hashedPassword,
        confirmPassword:hashedPassword1,
        rememberMe,
    })
   
  /*var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type:'OAuth2',
        user: 'magnifiqueni01@gmail.com',
        clientId:'43715925189-8bi59lq2d90apssvlm6uj41s1sv2imlp.apps.googleusercontent.com',
        clientSecret:'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',
        refreshToken:"1//04N9SEw5J9luyCgYIARAAGAQSNwF-L9IrzS1qzflxAs3lHxxl1KKAw36Dgo85rUCTnzzUN0slRd9-PPl5oZMB-fanN9sbRyLQvJg",
         accessToken:oauth2Client.getAccessToken()
    }
});

var mailoptions = {
    from: 'magnifique.coding@gmail.com',
    to: email,
    subject: "Welcome to Magnifique's platform",
    html: `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color:#1E90FF; border-radius: 8px;color:white; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <p style="color: #555; font-size: 20px; line-height: 1.6; margin-bottom: 20px;">Dear Mr/Miss <span style="color: #333; font-weight: bold;">${fullname}</span>,</p>
        <p style="color: white; line-height: 1.6; font-size:18px">Thank you for registering with Magnifique's platform. Your account has been successfully created.</p>
        <p style="color: white; line-height: 1.6; font-size:18px">Please click the button below to verify your email address and activate your account:</p>
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="handleConfirmation()" style="display: inline-block; padding: 10px 20px; background-color: #007bff; border: none; color: #fff; font-size: 16px; cursor: pointer;border:2 px solid white; border-radius: 5px; text-decoration: none;">Verify Email</button>
        </div>
        <script>
            function handleConfirmation() {
                alert('Email has been successfully verified.');
                window.location.href = '/RegistrationCheck?id=${encodeURIComponent(email)}&name=${encodeURIComponent(fullname)}';
            }
        </script>
    </div>`
};

transporter.sendMail(mailoptions, function (error, info) {
    if (error) {
        console.log('Failed to send email', error);
    } else {
        console.log('You have received an email', info.response);
    }

});*/
res.status(201).send({message:'User registered',redirectTo:'/login'});
} catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send({ message: 'Unable to register', error });
}
})
const schoolExamUsers=new mongoose.Schema({

    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    Teachers:{
        type:Number,
    },
    Address:{
        type:String,
    },
    Logo:{
        type:String,
    },
    Schoolmotto :{
        type:String
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    rememberMe:{
        type:String,
        required:true,
    },
    RegistationInfo:[]
});
mongoose.model('SchoolExamUsers',schoolExamUsers);
const School=mongoose.model('SchoolExamUsers');

app.post('/registerSchool', async (req,res)=>{
    const {fullname,email,Teachers,Address,Logo,Schoolmotto,password,confirmPassword,rememberMe}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const hashedPassword1=await bcrypt.hash(confirmPassword,10);

    const OldUsers=await School.findOne({email})

    if(OldUsers)
    {
        return res.status(400).send({message:'Usanzwe uri muri sisiteme'});
    }
    if(password!==confirmPassword)
    {
        return res.status(400).send({message:'Password ntago zihura'});
    }
    if(password<6 || confirmPassword<6)
    {
        return res.status(400).send({message:'Password must greater than six'});
    }
    try {
    await School.create({
        fullname,
        email,
        Teachers,
        Address,
        Logo,
        Schoolmotto,
        password:hashedPassword,
        confirmPassword:hashedPassword1,
        rememberMe,
    })
   
  /*var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type:'OAuth2',
        user: 'magnifiqueni01@gmail.com',
        clientId:'43715925189-8bi59lq2d90apssvlm6uj41s1sv2imlp.apps.googleusercontent.com',
        clientSecret:'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',
        refreshToken:"1//04N9SEw5J9luyCgYIARAAGAQSNwF-L9IrzS1qzflxAs3lHxxl1KKAw36Dgo85rUCTnzzUN0slRd9-PPl5oZMB-fanN9sbRyLQvJg",
         accessToken:oauth2Client.getAccessToken()
    }
});

var mailoptions = {
    from: 'magnifique.coding@gmail.com',
    to: email,
    subject: "Welcome to Magnifique's platform",
    html: `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color:#1E90FF; border-radius: 8px;color:white; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <p style="color: #555; font-size: 20px; line-height: 1.6; margin-bottom: 20px;">Dear Mr/Miss <span style="color: #333; font-weight: bold;">${fullname}</span>,</p>
        <p style="color: white; line-height: 1.6; font-size:18px">Thank you for registering with Magnifique's platform. Your account has been successfully created.</p>
        <p style="color: white; line-height: 1.6; font-size:18px">Please click the button below to verify your email address and activate your account:</p>
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="handleConfirmation()" style="display: inline-block; padding: 10px 20px; background-color: #007bff; border: none; color: #fff; font-size: 16px; cursor: pointer;border:2 px solid white; border-radius: 5px; text-decoration: none;">Verify Email</button>
        </div>
        <script>
            function handleConfirmation() {
                alert('Email has been successfully verified.');
                window.location.href = '/RegistrationCheck?id=${encodeURIComponent(email)}&name=${encodeURIComponent(fullname)}';
            }
        </script>
    </div>`
};

transporter.sendMail(mailoptions, function (error, info) {
    if (error) {
        console.log('Failed to send email', error);
    } else {
        console.log('You have received an email', info.response);
    }

});*/
res.status(201).send({message:'School registered',redirectTo:'/login'});
} catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send({ message: 'Unable to register', error });
}
})

app.get('/tasks/', async (req,res)=>{
    const email=req.headers.email;
    const emails=localStorage.getItem(email);
    console.log('Personal',email);
    console.log('Personal',emails);
    try {
        const Tasks=await Users.find({email});
            res.json(Tasks)
    }
    catch(error){
        console.log('Failed',error);
        res.status(500).send({message:'Failed to find users'})
    }
})

const App_purpose=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
    },
    name:String,
    purpose:{
        type:String,
        required:true,
    },
    date:Date
})
mongoose.model('User_purpose',App_purpose);
const Purpose=mongoose.model('User_purpose');
app.post('/registers', async (req,res)=>{
    const {email,name,purpose,date}=req.body;
    const Oldpurpose=await Purpose.findOne({email})
    if(Oldpurpose)
    {
        return res.status(400).send({message:'Purpose already established'});
    }
    await Purpose.create({
        email,
        name,
        purpose,
        date:Date.now()
    })
    .then(()=>{
        res.json({email:email,purpose:purpose});
    })
    .catch((error)=>{
        console.log('Error setting purpose',error);
        res.status(500).send({error:'Purpose not setted'})
    })
})


const ExamSchema=new mongoose.Schema ({
    email:{type:String,required:true},
    Names:{type:String,required:true},
    title:String,
    description:String,
    duration:Number,
    start_time:Date,
    end_time:Date,
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question',
    }],
    creator_id:{type:String,required:true}
});

const Exam=mongoose.model('ExamSchema',ExamSchema);
const QuestionSchema=new mongoose.Schema({
    email:{type:String,required:true},
    Names:{type:String,required:true},
    Token:String,
    question_text:String,
    options:[String],
    correct_option:String,
    type:{
        type:String,
        enum:['multiple_choice','checked_box','true_false','short_answer','programming','selects','mathematics'],
        default:'None'
    },
    
})
const Question=mongoose.model('QuestionSchema',QuestionSchema);

const ResponseSchema=new mongoose.Schema({
    email:{type:String,required:true},
    Names:{type:String,required:true},
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    exam_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Exam'
    },
    question_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    },
    Token:{type:String,required:true},
    answers:[
        {
         question_id:String,
         response:String,
         Mark:{type:Number,default:0}
    }],
    score:Number
});

mongoose.model('ExamUsers',ExamUsers);
const User=mongoose.model('ExamUsers');

const Response=mongoose.model('ResponseSchema',ResponseSchema);


app.post('/Exam', async (req,res)=>{
const {email,Names,title,description,duration,start_time,end_time,creator_id}=req.body;
await Exam.create({
    email,
    Names,
    title,
    description,
    duration,
    start_time,
    end_time,
    creator_id,
})
.then(()=>{
    res.json('Well added');
})
.catch((error)=>{
    res.status(500).send({error:'Server error'});
        console.log(error);
})
})


app.post('/questionForm', async (req,res)=>{
    const {email,Names,Token,question_text,options,correct_option,type}=req.body;
    await Question.create({
        email,
        Names,
        Token,
        question_text,
        options,
        correct_option,
        type:type,
    })
    .then(()=>{
        res.status(200).json({message:'Question added successfully'});
        console.log('Well added');
    })
    .catch((error)=>{
        res.status(500).send({error:'Server error'});
        console.log(error);
    })
})
app.get('/Exams', async (req,res)=>{
    const emails=req.headers.email;
    const Name=req.headers.name;
    const Token=req.headers.tokens;
    console.log(emails,Name);
    try {
    const Section=await Question.find({email:emails,Names:Name,Token:Token});
    if(Section)
    {
    
           return res.json(Section);
    }
    else {
        return res.status(400).send({error:'No question found under this account'});
    }
}
catch(error){
    console.log('Failed to fetch data');
    res.status(500).send({error:'Failed to fetch questions'});
}
})

app.post('/solution', async (req,res)=>{
    const {email,Names,Token,responses}=req.body;
    console.log(email,Names,Token);
    const submittedResponse=[];
try{
    for(const{question_id,response} of responses)
    {
        const newResponse=new Response({email,Names,answers:{question_id,response,Mark:0},Token});
        const savedResponse=await newResponse.save();
        submittedResponse.push(savedResponse);
    }
    return res.status(201).json({message:'Submitted'});
}
catch(error){
    console.error('Error submitting',error);
    return res.status(500).json({message:'Internal application error'});
}
})
const MarkShema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    Names: {
        type: String,
        required: true
    },
    Token: {
        type: String,
        required: true
    },
    totalmark: {
        type: Number,
        required: true
    },
})
const Markpaper=mongoose.model('Markschema',MarkShema)
app.get('/scores', async (req,res)=>{
    const emails=req.headers.email;
    const Name=req.headers.name;
    const tokens=req.headers.tokens;
    Response.find({email:emails,Names:Name,Token:tokens})
        .then((responses)=>{

    Question.find({email:emails,Names:Name,Token:tokens})
        .then((questions)=>{
            let totalScore=0;
            const scores=responses.forEach(response=>{
            const userScore=response.answers.reduce((totalScore,answer)=>{
                const question=questions.find(q=>q._id.equals(answer.question_id));
                if(question && question.correct_option===answer.response)
                {
                    answer.Mark=1;
                    return totalScore+1;
                }
                else {
                    answer.mark=0;
                   return totalScore; 
                }
            },0)
            Response.findByIdAndUpdate(response._id,response,{new:true})
            .then(()=>{
                console.log('Updated')
            })
            .catch((error)=>{
                console.error(error);
            });

            totalScore+=userScore;
              Markpaper.create({
                email: emails,
                Names: Name,
                Token: tokens,
                totalmark: userScore,
            });
            return {user_id:response._id, score:userScore};
        });
        res.json({totalScore:totalScore});
        console.log(scores)
    })
    .catch((err)=>{
        console.error('Error',err);
        res.status(500).json({error:'Server error'});
    })
    })
    .catch((err)=>{
        console.error('Error again',err);
        res.status(500).json({error:'Server error'});
    })
});

app.get('/question_solution', async (req,res)=>{
    const emails=req.headers.email;
    const Name=req.headers.name;
    const Token=req.headers.tokens;
    console.log(Token);
    await Question.find({email:emails,Names:Name,Token:Token})
       .then(questions=>{
        Response.find({email:emails,Names:Name})
        .then(responses=>{
            const questionSolutions=questions.map(question=>{
                const matchedResponse=responses.find(response=>
                    response.answers.some(answer=>
                        answer.question_id.toString()===question._id.toString() &&
                        answer.response===question.correct_option
                    )
                );

                const solution={
                    question_id:question._id,
                    question_text:question.question_text,
                    options:question.options,
                    solution:question.correct_option,
                    status:matchedResponse? 'green':'red'
                }
                return solution;
            })
            res.json(questionSolutions);
        })
        .catch(err=>{
            console.error('Error occured',err);
            res.status(500).json({error:'Internal application error'});
        })
        .catch(err=>{
            console.log('error again',err);
            res.status(500).json({error:'Internal server error'});
        })
       })
})


app.post('/registering', async (req,res)=>{
    const {email,name,purpose,date}=req.body;
    const Oldpurpose=await Purpose.findOne({email})
    if(Oldpurpose)
    {
        return res.status(400).send({message:'Purpose already established'});
    }
    await Purpose.create({
        email,
        name,
        purpose:"Business purpose",
        date:Date.now()
    })
    .then(()=>{
        res.json({email:email,purpose:purpose});
    })
    .catch((error)=>{
        console.log('Error setting purpose',error);
        res.status(500).send({error:'Purpose not setted'})
    })
})
app.post('/reg', async (req,res)=>{
    const {email,name,purpose,date}=req.body;
    const Oldpurpose=await Purpose.findOne({email})
    if(Oldpurpose)
    {
        return res.status(400).send({message:'Purpose already established'});
    }
    await Purpose.create({
        email,
        name,
        purpose:"Self study",
        date:Date.now()
    })
    .then(()=>{
        res.json({email:email,purpose:purpose});
    })
    .catch((error)=>{
        console.log('Error setting purpose',error);
        res.status(500).send({error:'Purpose not setted'})
    })
})

app.post('/regs', async (req,res)=>{
    const {email,name,purpose,date}=req.body;
    const Oldpurpose=await Purpose.findOne({email})
    if(Oldpurpose)
    {
        return res.status(400).send({message:'Purpose already established'});
    }
    await Purpose.create({
        email,
        name,
        purpose:"Campany or organisation",
        date:Date.now()
    })
    .then(()=>{
        res.json({email:email,purpose:purpose});
    })
    .catch((error)=>{
        console.log('Error setting purpose',error);
        res.status(500).send({error:'Purpose not setted'})
    })
})
app.post('/re', async (req,res)=>{
    const {email,name,purpose,date}=req.body;
    const Oldpurpose=await Purpose.findOne({email})
    if(Oldpurpose)
    {
        return res.status(400).send({message:'Purpose already established'});
    }
    await Purpose.create({
        email,
        name,
        purpose:"E-recurtiment",
        date:Date.now()
    })
    .then(()=>{
        res.json({email:email,purpose:purpose});
    })
    .catch((error)=>{
        console.log('Error setting purpose',error);
        res.status(500).send({error:'Purpose not setted'})
    })
})
app.post('/r', async (req,res)=>{
    const {email,name,purpose,date}=req.body;
    const Oldpurpose=await Purpose.findOne({email})
    if(Oldpurpose)
    {
        return res.status(400).send({message:'Purpose already established'});
    }
    await Purpose.create({
        email,
        name,
        purpose:"Non profit organization",
        date:Date.now()
    })
    .then(()=>{
        res.json({email:email,purpose:purpose});
    })
    .catch((error)=>{
        console.log('Error setting purpose',error);
        res.status(500).send({error:'Purpose not setted'})
    })
})

app.post('/login', async (req,res)=>{
    const {email,password}=req.body;
    try {
        const UserAccount=await Users.findOne({email});
        const FindCompleteRegistration=await Purpose.find({email})
        console.log('Aleady in',FindCompleteRegistration);
        if(UserAccount) {
            const UnhashedPassword=await bcrypt.compare(password,UserAccount.password);
            if(UnhashedPassword) {
                if(FindCompleteRegistration)
                {
                    const tokenkey=jwt.sign({userId:UserRegs._id},'magnifqtr',{expiresIn:'1h'});
                res.setHeader('x-user-email',email);
                return res.json({UserAccount,tokenkey});
                }
                else {
                redirect('/RegistrationCheck');
                console.log('Finish registration befero you continue');
                }
            } else {
                return res.json('notexist');
            }
        } else {
            res.status(401).json({error:'Invalid credentials'});
        }
    } catch(error) {
        console.log('Failed',error);
        res.status(401).json({error:'Failed'});
    }
})

app.get('/mins', async (req,res)=>{
    const emails=req.headers.email;
    const Name=req.headers.name;
    const Token=req.headers.tokens;
    console.log(emails,Name,Token);
try {
    const Minutes=await Exam.find({email:emails,Names:Name,creator_id:Token})
    if(Minutes)
    {
       return res.json(Minutes);
    }
}
    catch(err){
        console.log(err);
        res.status(500).send({error:'Internal applilcation error'});
    }

})

app.get('/User/:tokens', async (req, res) => {
    const { tokens } = req.params;
    try {
        const Exams = await Exam.find({ creator_id: tokens });
        console.log(Exams);
        if (Exams.length > 0) { // Check if Exams array is not empty
            return res.json(Exams);
        } else {
            return res.status(404).send({ message: 'Invalid token, Make sure you entered valid token' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal application error' });
    }
});

/*const ExamQuestions=new mongoose.Schema({
    fullname: {type:String,required:true},
    email:{type:String, required:true},
    newQuestion:{type:String,required:true},
    solution:{type:String, required:true},
    ExamKey:{type:String, required:true},
    Minute:{type:Number},
    choices:{
        choice1:{type:String},
        choice2:{type:String},
        choice3:{type:String},
        choice4:{type:String},
},
actualsolution:{
    check1:String,
    check2:String,
    check3:String,
    check4:String,
},
time:Date,
})
mongoose.model('ExamQuestions',ExamQuestions);
const Questions=mongoose.model('ExamQuestions',ExamQuestions);

app.post('/question',async (req,res)=>{
   const {fullname,email,newQuestion,solution,Minute,ExamKey,choice1,choice2,choice3,choice4,check1,check2,check3,check4}=req.body;
   await Questions.create({
    fullname,
    email,
    newQuestion,
    solution,
    ExamKey,
    Minute,
    choices:{
        choice1,
        choice2,
        choice3,
        choice4,
    },
    actualsolution:{
        check1,
        check2,
        check3,
        check4,
    },
    time:Date.now(),
   })
   .then(()=>{
    console.log('Question added');
    res.status(200).json({message:'Question created'});
   })
   .catch((error)=>{
    console.log('Error adding',error);
    res.status(500).send({error:'Error adding new question'});
   })
})

app.get('/getQ', async (req,res)=>{
    const emails=req.headers.email;
    const token=req.headers.token;
    console.log('filtering email',emails);
    console.log('Exam Key',token);

    try{
    const SectionQuestion= await Questions.find({emails});
    const Section=await Questions.find({ExamKey:token,email:emails});
    if(Section)
    {
        if(SectionQuestion)
        {
           return res.json(Section);
        }
        else {
           return res.status(400).send({error:'No question found'});
        }
    }
    else {
        return res.status(400).send({error:'No question found under this account'});
    }
}
catch(error){
    console.log('Failed to fetch data');
    res.status(500).send({error:'Failed to fetch questions'});
}
})

app.get('/getS', async (req,res)=>{
    const emails=req.headers.email;
    const token=req.headers.token;
    console.log('filtering email',emails);
    console.log('Exam Key',token);

    try{
    const SectionQuestion= await Questions.find({email:emails});
    const Section=await Questions.find({
        ExamKey:token,
        email:emails
    });

    if(Section)
    {
        if(SectionQuestion)
        {
           return res.json(Section);
        }
        else {
           return res.status(400).send({error:'No question found'});
        }
    }
    else {
        return res.status(400).send({error:'No question found under this account'});
    }
}
catch(error){
    console.log('Failed to fetch data');
    res.status(500).send({error:'Failed to fetch questions'});
}
})
*/
app.get('/tokens', async (req,res)=>{
    const emails=req.headers.email;
    console.log('filtering email',emails);

    try{
    const Section=await Exam.find({email:emails});
    console.log(Section);

    if(Section)
    {
           return res.json(Section);
    }
    else {
        return res.status(400).send({error:'No question found under this account'});
    }
}
catch(error){
    console.log('Failed to fetch data',error);
    res.status(500).send({error:'Failed to fetch questions'});
}
})
app.get('/token', async (req,res)=>{
    const emails=req.headers.email;
    console.log('filtering email',emails);

    try{
    const Section=await Exam.find({creator_id:emails});
    console.log(Section);

    if(Section)
    {
           return res.json(Section);
    }
    else {
        return res.status(400).send({error:'No question found under this account'});
    }
}
catch(error){
    console.log('Failed to fetch data',error);
    res.status(500).send({error:'Failed to fetch questions'});
}
})

const PublicView=new mongoose.Schema({
    text: {
        type:String,
        required:true
    },
    sender:{
        type:String,
    },
    date:Date,
    Time:Date
})
const Public=mongoose.model('Publicview',PublicView);

const activeUsers={};

io.on('connection', async (socket) => {
    console.log('A user is connected');
    const userId = socket.handshake.query.token;
    const userToken = socket.handshake.query.tokens;
    const userName = socket.handshake.query.names;

    console.log(userId, userToken);
    try {
        const user = await UserRegs.findOne({ Tokens: userToken, Email: userId }).populate('Fullname');
        if (user) {
            console.log(userName, ' connected');
            io.emit('user connected', userName);

            // Load messages
            const messages = await Public.find();
            socket.emit('loadMessages', messages);

            // Handle sending messages
            socket.on('sendMessage', (messageData) => {
                const newMessage = new Public({
                    text: messageData.text,
                    sender: messageData.sender,
                    date: Date.now(),
                });
                newMessage.save()
                    .then((savedMessage) => {
                        io.emit('newMessage', savedMessage);
                    })
                    .catch(error => {
                        console.error('Error saving message', error);
                    });
            });

            // Handle screen sharing
            socket.on('startScreenSharing', (stream) => {
                socket.broadcast.emit('sharedScreen', stream);
            });

            socket.on('stopScreenSharing', () => {
                socket.broadcast.emit('sharedScreen', null);
            });

            // Handle typing
            socket.on('typing', () => {
                socket.broadcast.emit('typing');
            });

            // Handle user activity
            socket.on('User active', (userId) => {
                activeUsers[userId] = true;
                io.emit('activeUsers', Object.keys(activeUsers));
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('A user disconnected');
                delete activeUsers[socket.id];
                io.emit('activeUsers', Object.keys(activeUsers));
            });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.log(error.message);
        socket.disconnect(true);
    }
});


app.post('/publicview', async (req,res)=>{
     const {message}=req.body;
     console.log(message);
     await Public.create({
        text:message,
        date:Date.now(),
        time:Date.now(),
     })  
     .then(()=>{
        res.json('Message sent to the public');
     })
     .catch((err)=>{
        res.status(500).send({error:'Internal application error'});
        console.error(err);
     })
})

app.get('/publicView', async(req,res)=>{
    try {
    const messages=await Public.find({})
    if(messages)
    {
        return res.json(messages);
    }
    else {
        return res.json('No message found')
    }
    }
    catch(error){
        console.log(error);
        res.status(500).send({error:'Internal application error'});
    }
   
})

app.delete('/tasks/:taskId', async (req,res)=>{
    const {taskId}=req.params;

    try {
        const deleteTask=await Question.findByIdAndDelete(taskId);
        if(!deleteTask)
        {
            return res.status(404).json({message:'Task not found'});
        }
        res.status(200).json({message:'Task deleted successfully'});
    }
    catch(error){
        console.error('Error deleting task',error);
        res.status(500).json({message:'Internal server error'});
    }
})
app.get('/tasks/:taskId', async (req,res)=>{
    const {taskId}=req.params;
    console.log(taskId);
    try {
        const Task=await Question.find({Token:taskId});
        if(!Task)
        {
            return res.status(404).json({message:'Task not found'});
        }
        res.json(Task);
    }
    catch(error){
        console.error('Error exploring task',error);
        res.status(500).json({message:'Internal server error'});
    }
})

const userReg=new mongoose.Schema({
    Fullname:{type:String, required:true},
    Email:{type:String,required:true},
    regNo:{String},
    Tokens:{type:String,required:true},
    code:String,
    date:String,
})
const UserRegs=mongoose.model('UserClients',userReg);

app.post('/userReg', async (req,res)=>{
    const {Fullname, Email,regNo,code,Tokens}=req.body;
    const findExam=await UserRegs.find({Email:Email,Tokens:Tokens});
    await UserRegs.create({
        Fullname,
        Email,
        regNo,
        code,
        Tokens,
        date:Date.now()
    })
    .then(()=>{
        res.json('User registred');
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).send({error:'Internal application error'})
    })
})

app.get('/ExamUser', async (req,res)=>{
    const Token=req.headers.tokens;
    console.log(Token);
    try {
    const Section=await Question.find({Token:Token});
    if(Section)
    {
    
           return res.json(Section);
    }
    else {
        return res.status(400).send({error:'No question found under this account'});
    }
}
catch(error){
    console.log('Failed to fetch data');
    res.status(500).send({error:'Failed to fetch questions'});
}
})

app.get('/minsUser', async (req,res)=>{
    const Token=req.headers.tokens;
    console.log(Token);
try {
    const Minutes=await Exam.find({creator_id:Token})
    if(Minutes)
    {
       return res.json(Minutes);
    }
}
    catch(err){
        console.log(err);
        res.status(500).send({error:'Internal applilcation error'});
    }

})
app.post('/usersolution', async (req,res)=>{
    const {email,Names,Token,responses}=req.body;
    console.log(email,Names,Token);
    const submittedResponse=[];
try{
    for(const{question_id,response} of responses)
    {
        const newResponse=new Response({email,Names,answers:{question_id,response,Mark:0},Token});
        const savedResponse=await newResponse.save();
        submittedResponse.push(savedResponse);
    }
    return res.status(201).json({message:'Submitted'});
}
catch(error){
    console.error('Error submitting',error);
    return res.status(500).json({message:'Internal application error'});
}
})

app.get('/question_usersolution', async (req,res)=>{
    const emails=req.headers.email;
    const Name=req.headers.name;
    const Token=req.headers.tokens;
    console.log(Token,emails,Name);
    await Question.find({Token:Token})
       .then(questions=>{
        Response.find({email:emails,Names:Name,Token:Token})
        .then(responses=>{
            const questionSolutions=questions.map(question=>{
                const matchedResponse=responses.find(response=>
                    response.answers.some(answer=>
                        answer.question_id.toString()===question._id.toString() &&
                        answer.response===question.correct_option
                    )
                );

                const solution={
                    question_id:question._id,
                    question_text:question.question_text,
                    options:question.options,
                    solution:question.correct_option,
                    status:matchedResponse? 'green':'red'
                }
                return solution;
            })
            res.json(questionSolutions);
        })
        .catch(err=>{
            console.error('Error occured',err);
            res.status(500).json({error:'Internal application error'});
        })
        .catch(err=>{
            console.log('error again',err);
            res.status(500).json({error:'Internal server error'});
        })
       })
})
app.get('/userscores', async (req,res)=>{
    const emails=req.headers.email;
    const Name=req.headers.name;
    const tokens=req.headers.tokens;
    Response.find({email:emails,Names:Name,Token:tokens})
        .then((responses)=>{

    Question.find({Token:tokens})
        .then((questions)=>{
            let totalScore=0;
            const scores=responses.forEach(response=>{
            const userScore=response.answers.reduce((totalScore,answer)=>{
                const question=questions.find(q=>q._id.equals(answer.question_id));
                if(question && question.correct_option===answer.response)
                {
                    answer.Mark=1;
                    return totalScore+1;
                }
                else {
                    answer.mark=0;
                   return totalScore; 
                }
            },0)
            Response.findByIdAndUpdate(response._id,response,{new:true})
            .then(()=>{
                console.log('Updated')
            })
            .catch((error)=>{
                console.error(error);
            });

            totalScore+=userScore;
            return {user_id:response._id, score:userScore};
        });
        res.json({totalScore:totalScore});
        console.log(scores)
        Markpaper.create({
            email: emails,
            Names: Name,
            Token: tokens,
            totalmark:totalScore,
        });
    })
    .catch((err)=>{
        console.error('Error',err);
        res.status(500).json({error:'Server error'});
    })
    })
    .catch((err)=>{
        console.error('Error again',err);
        res.status(500).json({error:'Server error'});
    })
});
app.get('/userDid/:tasksId',async (req,res)=>{
    const {tasksId}=req.params;
    console.log(tasksId);
    try {
    const UserDid=await Response.find({Token:tasksId})
    .distinct('Names');
    if(UserDid)
    {
        return res.json(UserDid);
    }
}
    catch(err)
    {
        console.log('Internal application error',err);
        res.status(500).send({error:'Internal application error'});
    }
})
app.get('/all/:name/:token',async (req,res)=>{
    const {name}=req.params;
    const {token}=req.params;
    console.log(name);
    console.log(token);
    await Question.find({Token:token})
       .then(questions=>{
        Response.find({Names:name,Token:token})
        .then(responses=>{
            const questionSolutions=questions.map(question=>{
                const matchedResponse=responses.find(response=>
                    response.answers.some(answer=>
                        answer.question_id.toString()===question._id.toString() &&
                        answer.response===question.correct_option
                    )
                );

                const solution={
                    question_id:question._id,
                    question_text:question.question_text,
                    options:question.options,
                    solution:question.correct_option,
                    status:matchedResponse? 'green':'red'
                }
                return solution;
            })
            res.json(questionSolutions);
        })
        .catch(err=>{
            console.error('Error occured',err);
            res.status(500).json({error:'Internal application error'});
        })
        .catch(err=>{
            console.log('error again',err);
            res.status(500).json({error:'Internal server error'});
        })
       })
})

app.get('/studentmarks/:tokens',async(req,res)=>{
    const {tokens}=req.params;
    console.log('this your token',tokens);
    try{
    const Marks=await Markpaper.find({Token:tokens});
    if(Marks)
    {
       return res.json(Marks);
    }
    else {
        return res.status(404).json({error:'Not found'});
    }
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:'Internal application error'})
    }
})
/*
app.get('/getT/:tokenId', async (req,res)=>{
    const {tokenId}=req.params;
    const emails=req.headers.email;
    console.log('This email of finder',emails);
    console.log('this token exam',tokenId);
    try {
        const QuestionTask=await Questions.find({email:emails,ExamKey:tokenId})
        if(!QuestionTask)
        {
            return res.status(404).json({message:'Questions not found'});
        }
        res.json(QuestionTask);
    }
    catch(error){
        console.error('Error fetching questions task',error);
        res.status(500).json({message:'Internal server error'});
    }
})

app.get('/minute', async(req,res)=>{
    const emails=req.headers.email;
    const token=req.headers.token;
    console.log('Emails for sum',emails)
    const Myaccount=await Questions.find({email:emails,ExamKey:token});
    if(Myaccount)
    {
        await Questions.aggregate([
            {
            $match:{
                ExamKey:token,
            }
        },
        {
            $group:{
                _id:token,
                totalScore:{
                    $sum:'$Minute',
                }
            }
        }
        ])
        .then((results)=>{
        
                console.log("The sum of Minute for same token is");
                results.forEach(result=>{
                   console.log("Token:",result._id, "Total Minute:",result.totalScore)
                   res.json({Minutes:result.totalScore});
                })
            })
            .catch((error)=>{
            console.error(error)
        })
        
    }
    else {
        res.status(500).send({message:'Internal application error'});
    }
})

const Mysolution= new mongoose.Schema({
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    },
    emails:{type:String,required:true},
    name:{type:String,required:true},
    questions:[String],
    choice:[String],
    ExamKey:String
})
mongoose.model('Solutions',Mysolution);
const Solution=mongoose.model('Solutions');

app.post('/submits', async (req, res) => {
  try {
    const { checkedValue, questions } = req.body;
    const {fullname,email}=req.body;
    console.log(questions);
    console.log('The passed values:', checkedValue);
    const checkedChoices = await Promise.all(
      Object.entries(checkedValue,questions).map(async ([questionIndex, choice]) => {
        await Solution.create({
            emails:email,
            name:fullname,
            questionIndex,
            choice,
            questions:questions,
            ExamKey:'Exam1'
        })
      })
    );
    res.json({message:'Sucessfully submitted', values:{checkedChoices}});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal application error' });
  }
});


const actualSolution= Questions.find({ExamKey:'mernr'});
const solutions=Solution.find({});
let matchFound=false;
    if(actualSolution.actualsolution===solutions.choice||actualSolution.actualsolution===solutions.choice)
    {
        matchFound=true;
    }

if(matchFound)
{
    console.log('Well done');
}
else {
    console.log('Fail');
}
*/

server.listen(port,()=>{
    console.log(`The server is running on port ${port}`);
})