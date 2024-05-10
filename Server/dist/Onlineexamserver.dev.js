"use strict";

var express = require('express');

var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

var cors = require('cors');

var nodemailer = require('nodemailer');

var _require = require('googleapis'),
    google = _require.google;

var _require2 = require('react-router-dom'),
    redirect = _require2.redirect;

var socketIo = require('socket.io');

var http = require('http');

var _require3 = require('os'),
    type = _require3.type;

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server, {
  cors: {
    orgin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(cors({
  orgin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
var port = process.env.PORT || 5000;
var corsOptions = {
  allowedHeaders: ['Content-Type', 'x-user-email']
};
app.use(cors(corsOptions));
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2('43715925189-8bi59lq2d90apssvlm6uj41s1sv2imlp.apps.googleusercontent.com', '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', 'https://developers.google.com/oauthplayground');
oauth2Client.setCredentials({
  refresh_token: '1//04N9SEw5J9luyCgYIARAAGAQSNwF-L9IrzS1qzflxAs3lHxxl1KKAw36Dgo85rUCTnzzUN0slRd9-PPl5oZMB-fanN9sbRyLQvJg'
});
var password = process.env.MONGODB_PASSWORD;
mongoose.connect("mongodb+srv://engineermaque:qkXAa1DKrs668MGT@cluster0.d0bzgaa.mongodb.net/onlineexams", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("Connected to MongoDB");
})["catch"](function (error) {
  console.error("Error connecting to MongoDB:", error);
});
var ExamUsers = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  rememberMe: {
    type: String,
    required: true
  },
  RegistationInfo: []
});
mongoose.model('ExamUsers', ExamUsers);
var Users = mongoose.model('ExamUsers');
app.post('/register', function _callee(req, res) {
  var _req$body, fullname, email, password, confirmPassword, rememberMe, hashedPassword, hashedPassword1, OldUsers;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, fullname = _req$body.fullname, email = _req$body.email, password = _req$body.password, confirmPassword = _req$body.confirmPassword, rememberMe = _req$body.rememberMe;
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 3:
          hashedPassword = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(bcrypt.hash(confirmPassword, 10));

        case 6:
          hashedPassword1 = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(Users.findOne({
            email: email
          }));

        case 9:
          OldUsers = _context.sent;

          if (!OldUsers) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            message: 'Usanzwe uri muri sisiteme'
          }));

        case 12:
          if (!(password !== confirmPassword)) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            message: 'Password ntago zihura'
          }));

        case 14:
          if (!(password < 6 || confirmPassword < 6)) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            message: 'Password must greater than six'
          }));

        case 16:
          _context.prev = 16;
          _context.next = 19;
          return regeneratorRuntime.awrap(Users.create({
            fullname: fullname,
            email: email,
            password: hashedPassword,
            confirmPassword: hashedPassword1,
            rememberMe: rememberMe
          }));

        case 19:
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
          res.status(201).send({
            message: 'User registered',
            redirectTo: '/login'
          });
          _context.next = 26;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](16);
          console.error('Error during registration:', _context.t0);
          res.status(500).send({
            message: 'Unable to register',
            error: _context.t0
          });

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[16, 22]]);
});
var schoolExamUsers = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  Teachers: {
    type: Number
  },
  Address: {
    type: String
  },
  Logo: {
    type: String
  },
  Schoolmotto: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  rememberMe: {
    type: String,
    required: true
  },
  RegistationInfo: []
});
mongoose.model('SchoolExamUsers', schoolExamUsers);
var School = mongoose.model('SchoolExamUsers');
app.post('/registerSchool', function _callee2(req, res) {
  var _req$body2, fullname, email, Teachers, Address, Logo, Schoolmotto, password, confirmPassword, rememberMe, hashedPassword, hashedPassword1, OldUsers;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, fullname = _req$body2.fullname, email = _req$body2.email, Teachers = _req$body2.Teachers, Address = _req$body2.Address, Logo = _req$body2.Logo, Schoolmotto = _req$body2.Schoolmotto, password = _req$body2.password, confirmPassword = _req$body2.confirmPassword, rememberMe = _req$body2.rememberMe;
          _context2.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 3:
          hashedPassword = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(bcrypt.hash(confirmPassword, 10));

        case 6:
          hashedPassword1 = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(School.findOne({
            email: email
          }));

        case 9:
          OldUsers = _context2.sent;

          if (!OldUsers) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(400).send({
            message: 'Usanzwe uri muri sisiteme'
          }));

        case 12:
          if (!(password !== confirmPassword)) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(400).send({
            message: 'Password ntago zihura'
          }));

        case 14:
          if (!(password < 6 || confirmPassword < 6)) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(400).send({
            message: 'Password must greater than six'
          }));

        case 16:
          _context2.prev = 16;
          _context2.next = 19;
          return regeneratorRuntime.awrap(School.create({
            fullname: fullname,
            email: email,
            Teachers: Teachers,
            Address: Address,
            Logo: Logo,
            Schoolmotto: Schoolmotto,
            password: hashedPassword,
            confirmPassword: hashedPassword1,
            rememberMe: rememberMe
          }));

        case 19:
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
          res.status(201).send({
            message: 'School registered',
            redirectTo: '/login'
          });
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](16);
          console.error('Error during registration:', _context2.t0);
          res.status(500).send({
            message: 'Unable to register',
            error: _context2.t0
          });

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[16, 22]]);
});
app.get('/tasks/', function _callee3(req, res) {
  var email, emails, Tasks;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.headers.email;
          emails = localStorage.getItem(email);
          console.log('Personal', email);
          console.log('Personal', emails);
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Users.find({
            email: email
          }));

        case 7:
          Tasks = _context3.sent;
          res.json(Tasks);
          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](4);
          console.log('Failed', _context3.t0);
          res.status(500).send({
            message: 'Failed to find users'
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 11]]);
});
var App_purpose = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  purpose: {
    type: String,
    required: true
  },
  date: Date
});
mongoose.model('User_purpose', App_purpose);
var Purpose = mongoose.model('User_purpose');
app.post('/registers', function _callee4(req, res) {
  var _req$body3, email, name, purpose, date, Oldpurpose;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, email = _req$body3.email, name = _req$body3.name, purpose = _req$body3.purpose, date = _req$body3.date;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Purpose.findOne({
            email: email
          }));

        case 3:
          Oldpurpose = _context4.sent;

          if (!Oldpurpose) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(400).send({
            message: 'Purpose already established'
          }));

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(Purpose.create({
            email: email,
            name: name,
            purpose: purpose,
            date: Date.now()
          }).then(function () {
            res.json({
              email: email,
              purpose: purpose
            });
          })["catch"](function (error) {
            console.log('Error setting purpose', error);
            res.status(500).send({
              error: 'Purpose not setted'
            });
          }));

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
});
var ExamSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  Names: {
    type: String,
    required: true
  },
  title: String,
  description: String,
  duration: Number,
  start_time: Date,
  end_time: Date,
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  creator_id: {
    type: String,
    required: true
  }
});
var Exam = mongoose.model('ExamSchema', ExamSchema);
var QuestionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  Names: {
    type: String,
    required: true
  },
  Token: String,
  question_text: String,
  options: [String],
  correct_option: String,
  type: {
    type: String,
    "enum": ['multiple_choice', 'checked_box', 'true_false', 'short_answer', 'programming', 'selects', 'mathematics'],
    "default": 'None'
  }
});
var Question = mongoose.model('QuestionSchema', QuestionSchema);
var ResponseSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  Names: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  Token: {
    type: String,
    required: true
  },
  answers: [{
    question_id: String,
    response: String,
    Mark: {
      type: Number,
      "default": 0
    }
  }],
  score: Number
});
mongoose.model('ExamUsers', ExamUsers);
var User = mongoose.model('ExamUsers');
var Response = mongoose.model('ResponseSchema', ResponseSchema);
app.post('/Exam', function _callee5(req, res) {
  var _req$body4, email, Names, title, description, duration, start_time, end_time, creator_id;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body4 = req.body, email = _req$body4.email, Names = _req$body4.Names, title = _req$body4.title, description = _req$body4.description, duration = _req$body4.duration, start_time = _req$body4.start_time, end_time = _req$body4.end_time, creator_id = _req$body4.creator_id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Exam.create({
            email: email,
            Names: Names,
            title: title,
            description: description,
            duration: duration,
            start_time: start_time,
            end_time: end_time,
            creator_id: creator_id
          }).then(function () {
            res.json('Well added');
          })["catch"](function (error) {
            res.status(500).send({
              error: 'Server error'
            });
            console.log(error);
          }));

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
});
app.post('/questionForm', function _callee6(req, res) {
  var _req$body5, email, Names, Token, question_text, options, correct_option, type;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body5 = req.body, email = _req$body5.email, Names = _req$body5.Names, Token = _req$body5.Token, question_text = _req$body5.question_text, options = _req$body5.options, correct_option = _req$body5.correct_option, type = _req$body5.type;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Question.create({
            email: email,
            Names: Names,
            Token: Token,
            question_text: question_text,
            options: options,
            correct_option: correct_option,
            type: type
          }).then(function () {
            res.status(200).json({
              message: 'Question added successfully'
            });
            console.log('Well added');
          })["catch"](function (error) {
            res.status(500).send({
              error: 'Server error'
            });
            console.log(error);
          }));

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
});
app.get('/Exams', function _callee7(req, res) {
  var emails, Name, Token, Section;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          emails = req.headers.email;
          Name = req.headers.name;
          Token = req.headers.tokens;
          console.log(emails, Name);
          _context7.prev = 4;
          _context7.next = 7;
          return regeneratorRuntime.awrap(Question.find({
            email: emails,
            Names: Name,
            Token: Token
          }));

        case 7:
          Section = _context7.sent;

          if (!Section) {
            _context7.next = 12;
            break;
          }

          return _context7.abrupt("return", res.json(Section));

        case 12:
          return _context7.abrupt("return", res.status(400).send({
            error: 'No question found under this account'
          }));

        case 13:
          _context7.next = 19;
          break;

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](4);
          console.log('Failed to fetch data');
          res.status(500).send({
            error: 'Failed to fetch questions'
          });

        case 19:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[4, 15]]);
});
app.post('/solution', function _callee8(req, res) {
  var _req$body6, email, Names, Token, responses, submittedResponse, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, question_id, response, newResponse, savedResponse;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body6 = req.body, email = _req$body6.email, Names = _req$body6.Names, Token = _req$body6.Token, responses = _req$body6.responses;
          console.log(email, Names, Token);
          submittedResponse = [];
          _context8.prev = 3;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context8.prev = 7;
          _iterator = responses[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context8.next = 19;
            break;
          }

          _step$value = _step.value, question_id = _step$value.question_id, response = _step$value.response;
          newResponse = new Response({
            email: email,
            Names: Names,
            answers: {
              question_id: question_id,
              response: response,
              Mark: 0
            },
            Token: Token
          });
          _context8.next = 14;
          return regeneratorRuntime.awrap(newResponse.save());

        case 14:
          savedResponse = _context8.sent;
          submittedResponse.push(savedResponse);

        case 16:
          _iteratorNormalCompletion = true;
          _context8.next = 9;
          break;

        case 19:
          _context8.next = 25;
          break;

        case 21:
          _context8.prev = 21;
          _context8.t0 = _context8["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context8.t0;

        case 25:
          _context8.prev = 25;
          _context8.prev = 26;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 28:
          _context8.prev = 28;

          if (!_didIteratorError) {
            _context8.next = 31;
            break;
          }

          throw _iteratorError;

        case 31:
          return _context8.finish(28);

        case 32:
          return _context8.finish(25);

        case 33:
          return _context8.abrupt("return", res.status(201).json({
            message: 'Submitted'
          }));

        case 36:
          _context8.prev = 36;
          _context8.t1 = _context8["catch"](3);
          console.error('Error submitting', _context8.t1);
          return _context8.abrupt("return", res.status(500).json({
            message: 'Internal application error'
          }));

        case 40:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 36], [7, 21, 25, 33], [26,, 28, 32]]);
});
var MarkShema = new mongoose.Schema({
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
  }
});
var Markpaper = mongoose.model('Markschema', MarkShema);
app.get('/scores', function _callee9(req, res) {
  var emails, Name, tokens;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          emails = req.headers.email;
          Name = req.headers.name;
          tokens = req.headers.tokens;
          Response.find({
            email: emails,
            Names: Name,
            Token: tokens
          }).then(function (responses) {
            Question.find({
              email: emails,
              Names: Name,
              Token: tokens
            }).then(function (questions) {
              var totalScore = 0;
              var scores = responses.forEach(function (response) {
                var userScore = response.answers.reduce(function (totalScore, answer) {
                  var question = questions.find(function (q) {
                    return q._id.equals(answer.question_id);
                  });

                  if (question && question.correct_option === answer.response) {
                    answer.Mark = 1;
                    return totalScore + 1;
                  } else {
                    answer.mark = 0;
                    return totalScore;
                  }
                }, 0);
                Response.findByIdAndUpdate(response._id, response, {
                  "new": true
                }).then(function () {
                  console.log('Updated');
                })["catch"](function (error) {
                  console.error(error);
                });
                totalScore += userScore;
                Markpaper.create({
                  email: emails,
                  Names: Name,
                  Token: tokens,
                  totalmark: userScore
                });
                return {
                  user_id: response._id,
                  score: userScore
                };
              });
              res.json({
                totalScore: totalScore
              });
              console.log(scores);
            })["catch"](function (err) {
              console.error('Error', err);
              res.status(500).json({
                error: 'Server error'
              });
            });
          })["catch"](function (err) {
            console.error('Error again', err);
            res.status(500).json({
              error: 'Server error'
            });
          });

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
});
app.get('/question_solution', function _callee10(req, res) {
  var emails, Name, Token;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          emails = req.headers.email;
          Name = req.headers.name;
          Token = req.headers.tokens;
          console.log(Token);
          _context10.next = 6;
          return regeneratorRuntime.awrap(Question.find({
            email: emails,
            Names: Name,
            Token: Token
          }).then(function (questions) {
            Response.find({
              email: emails,
              Names: Name
            }).then(function (responses) {
              var questionSolutions = questions.map(function (question) {
                var matchedResponse = responses.find(function (response) {
                  return response.answers.some(function (answer) {
                    return answer.question_id.toString() === question._id.toString() && answer.response === question.correct_option;
                  });
                });
                var solution = {
                  question_id: question._id,
                  question_text: question.question_text,
                  options: question.options,
                  solution: question.correct_option,
                  status: matchedResponse ? 'green' : 'red'
                };
                return solution;
              });
              res.json(questionSolutions);
            })["catch"](function (err) {
              console.error('Error occured', err);
              res.status(500).json({
                error: 'Internal application error'
              });
            })["catch"](function (err) {
              console.log('error again', err);
              res.status(500).json({
                error: 'Internal server error'
              });
            });
          }));

        case 6:
        case "end":
          return _context10.stop();
      }
    }
  });
});
app.post('/registering', function _callee11(req, res) {
  var _req$body7, email, name, purpose, date, Oldpurpose;

  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _req$body7 = req.body, email = _req$body7.email, name = _req$body7.name, purpose = _req$body7.purpose, date = _req$body7.date;
          _context11.next = 3;
          return regeneratorRuntime.awrap(Purpose.findOne({
            email: email
          }));

        case 3:
          Oldpurpose = _context11.sent;

          if (!Oldpurpose) {
            _context11.next = 6;
            break;
          }

          return _context11.abrupt("return", res.status(400).send({
            message: 'Purpose already established'
          }));

        case 6:
          _context11.next = 8;
          return regeneratorRuntime.awrap(Purpose.create({
            email: email,
            name: name,
            purpose: "Business purpose",
            date: Date.now()
          }).then(function () {
            res.json({
              email: email,
              purpose: purpose
            });
          })["catch"](function (error) {
            console.log('Error setting purpose', error);
            res.status(500).send({
              error: 'Purpose not setted'
            });
          }));

        case 8:
        case "end":
          return _context11.stop();
      }
    }
  });
});
app.post('/reg', function _callee12(req, res) {
  var _req$body8, email, name, purpose, date, Oldpurpose;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _req$body8 = req.body, email = _req$body8.email, name = _req$body8.name, purpose = _req$body8.purpose, date = _req$body8.date;
          _context12.next = 3;
          return regeneratorRuntime.awrap(Purpose.findOne({
            email: email
          }));

        case 3:
          Oldpurpose = _context12.sent;

          if (!Oldpurpose) {
            _context12.next = 6;
            break;
          }

          return _context12.abrupt("return", res.status(400).send({
            message: 'Purpose already established'
          }));

        case 6:
          _context12.next = 8;
          return regeneratorRuntime.awrap(Purpose.create({
            email: email,
            name: name,
            purpose: "Self study",
            date: Date.now()
          }).then(function () {
            res.json({
              email: email,
              purpose: purpose
            });
          })["catch"](function (error) {
            console.log('Error setting purpose', error);
            res.status(500).send({
              error: 'Purpose not setted'
            });
          }));

        case 8:
        case "end":
          return _context12.stop();
      }
    }
  });
});
app.post('/regs', function _callee13(req, res) {
  var _req$body9, email, name, purpose, date, Oldpurpose;

  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$body9 = req.body, email = _req$body9.email, name = _req$body9.name, purpose = _req$body9.purpose, date = _req$body9.date;
          _context13.next = 3;
          return regeneratorRuntime.awrap(Purpose.findOne({
            email: email
          }));

        case 3:
          Oldpurpose = _context13.sent;

          if (!Oldpurpose) {
            _context13.next = 6;
            break;
          }

          return _context13.abrupt("return", res.status(400).send({
            message: 'Purpose already established'
          }));

        case 6:
          _context13.next = 8;
          return regeneratorRuntime.awrap(Purpose.create({
            email: email,
            name: name,
            purpose: "Campany or organisation",
            date: Date.now()
          }).then(function () {
            res.json({
              email: email,
              purpose: purpose
            });
          })["catch"](function (error) {
            console.log('Error setting purpose', error);
            res.status(500).send({
              error: 'Purpose not setted'
            });
          }));

        case 8:
        case "end":
          return _context13.stop();
      }
    }
  });
});
app.post('/re', function _callee14(req, res) {
  var _req$body10, email, name, purpose, date, Oldpurpose;

  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _req$body10 = req.body, email = _req$body10.email, name = _req$body10.name, purpose = _req$body10.purpose, date = _req$body10.date;
          _context14.next = 3;
          return regeneratorRuntime.awrap(Purpose.findOne({
            email: email
          }));

        case 3:
          Oldpurpose = _context14.sent;

          if (!Oldpurpose) {
            _context14.next = 6;
            break;
          }

          return _context14.abrupt("return", res.status(400).send({
            message: 'Purpose already established'
          }));

        case 6:
          _context14.next = 8;
          return regeneratorRuntime.awrap(Purpose.create({
            email: email,
            name: name,
            purpose: "E-recurtiment",
            date: Date.now()
          }).then(function () {
            res.json({
              email: email,
              purpose: purpose
            });
          })["catch"](function (error) {
            console.log('Error setting purpose', error);
            res.status(500).send({
              error: 'Purpose not setted'
            });
          }));

        case 8:
        case "end":
          return _context14.stop();
      }
    }
  });
});
app.post('/r', function _callee15(req, res) {
  var _req$body11, email, name, purpose, date, Oldpurpose;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _req$body11 = req.body, email = _req$body11.email, name = _req$body11.name, purpose = _req$body11.purpose, date = _req$body11.date;
          _context15.next = 3;
          return regeneratorRuntime.awrap(Purpose.findOne({
            email: email
          }));

        case 3:
          Oldpurpose = _context15.sent;

          if (!Oldpurpose) {
            _context15.next = 6;
            break;
          }

          return _context15.abrupt("return", res.status(400).send({
            message: 'Purpose already established'
          }));

        case 6:
          _context15.next = 8;
          return regeneratorRuntime.awrap(Purpose.create({
            email: email,
            name: name,
            purpose: "Non profit organization",
            date: Date.now()
          }).then(function () {
            res.json({
              email: email,
              purpose: purpose
            });
          })["catch"](function (error) {
            console.log('Error setting purpose', error);
            res.status(500).send({
              error: 'Purpose not setted'
            });
          }));

        case 8:
        case "end":
          return _context15.stop();
      }
    }
  });
});
app.post('/login', function _callee16(req, res) {
  var _req$body12, email, password, UserAccount, FindCompleteRegistration, UnhashedPassword, tokenkey;

  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _req$body12 = req.body, email = _req$body12.email, password = _req$body12.password;
          _context16.prev = 1;
          _context16.next = 4;
          return regeneratorRuntime.awrap(Users.findOne({
            email: email
          }));

        case 4:
          UserAccount = _context16.sent;
          _context16.next = 7;
          return regeneratorRuntime.awrap(Purpose.find({
            email: email
          }));

        case 7:
          FindCompleteRegistration = _context16.sent;
          console.log('Aleady in', FindCompleteRegistration);

          if (!UserAccount) {
            _context16.next = 27;
            break;
          }

          _context16.next = 12;
          return regeneratorRuntime.awrap(bcrypt.compare(password, UserAccount.password));

        case 12:
          UnhashedPassword = _context16.sent;

          if (!UnhashedPassword) {
            _context16.next = 24;
            break;
          }

          if (!FindCompleteRegistration) {
            _context16.next = 20;
            break;
          }

          tokenkey = jwt.sign({
            userId: UserRegs._id
          }, 'magnifqtr', {
            expiresIn: '1h'
          });
          res.setHeader('x-user-email', email);
          return _context16.abrupt("return", res.json({
            UserAccount: UserAccount,
            tokenkey: tokenkey
          }));

        case 20:
          redirect('/RegistrationCheck');
          console.log('Finish registration befero you continue');

        case 22:
          _context16.next = 25;
          break;

        case 24:
          return _context16.abrupt("return", res.json('notexist'));

        case 25:
          _context16.next = 28;
          break;

        case 27:
          res.status(401).json({
            error: 'Invalid credentials'
          });

        case 28:
          _context16.next = 34;
          break;

        case 30:
          _context16.prev = 30;
          _context16.t0 = _context16["catch"](1);
          console.log('Failed', _context16.t0);
          res.status(401).json({
            error: 'Failed'
          });

        case 34:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[1, 30]]);
});
app.get('/mins', function _callee17(req, res) {
  var emails, Name, Token, Minutes;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          emails = req.headers.email;
          Name = req.headers.name;
          Token = req.headers.tokens;
          console.log(emails, Name, Token);
          _context17.prev = 4;
          _context17.next = 7;
          return regeneratorRuntime.awrap(Exam.find({
            email: emails,
            Names: Name,
            creator_id: Token
          }));

        case 7:
          Minutes = _context17.sent;

          if (!Minutes) {
            _context17.next = 10;
            break;
          }

          return _context17.abrupt("return", res.json(Minutes));

        case 10:
          _context17.next = 16;
          break;

        case 12:
          _context17.prev = 12;
          _context17.t0 = _context17["catch"](4);
          console.log(_context17.t0);
          res.status(500).send({
            error: 'Internal applilcation error'
          });

        case 16:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[4, 12]]);
});
app.get('/User/:tokens', function _callee18(req, res) {
  var tokens, Exams;
  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          tokens = req.params.tokens;
          _context18.prev = 1;
          _context18.next = 4;
          return regeneratorRuntime.awrap(Exam.find({
            creator_id: tokens
          }));

        case 4:
          Exams = _context18.sent;
          console.log(Exams);

          if (!(Exams.length > 0)) {
            _context18.next = 10;
            break;
          }

          return _context18.abrupt("return", res.json(Exams));

        case 10:
          return _context18.abrupt("return", res.status(404).send({
            message: 'Invalid token, Make sure you entered valid token'
          }));

        case 11:
          _context18.next = 17;
          break;

        case 13:
          _context18.prev = 13;
          _context18.t0 = _context18["catch"](1);
          console.log(_context18.t0);
          res.status(500).send({
            error: 'Internal application error'
          });

        case 17:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[1, 13]]);
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

app.get('/tokens', function _callee19(req, res) {
  var emails, Section;
  return regeneratorRuntime.async(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          emails = req.headers.email;
          console.log('filtering email', emails);
          _context19.prev = 2;
          _context19.next = 5;
          return regeneratorRuntime.awrap(Exam.find({
            email: emails
          }));

        case 5:
          Section = _context19.sent;
          console.log(Section);

          if (!Section) {
            _context19.next = 11;
            break;
          }

          return _context19.abrupt("return", res.json(Section));

        case 11:
          return _context19.abrupt("return", res.status(400).send({
            error: 'No question found under this account'
          }));

        case 12:
          _context19.next = 18;
          break;

        case 14:
          _context19.prev = 14;
          _context19.t0 = _context19["catch"](2);
          console.log('Failed to fetch data', _context19.t0);
          res.status(500).send({
            error: 'Failed to fetch questions'
          });

        case 18:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[2, 14]]);
});
app.get('/token', function _callee20(req, res) {
  var emails, Section;
  return regeneratorRuntime.async(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          emails = req.headers.email;
          console.log('filtering email', emails);
          _context20.prev = 2;
          _context20.next = 5;
          return regeneratorRuntime.awrap(Exam.find({
            creator_id: emails
          }));

        case 5:
          Section = _context20.sent;
          console.log(Section);

          if (!Section) {
            _context20.next = 11;
            break;
          }

          return _context20.abrupt("return", res.json(Section));

        case 11:
          return _context20.abrupt("return", res.status(400).send({
            error: 'No question found under this account'
          }));

        case 12:
          _context20.next = 18;
          break;

        case 14:
          _context20.prev = 14;
          _context20.t0 = _context20["catch"](2);
          console.log('Failed to fetch data', _context20.t0);
          res.status(500).send({
            error: 'Failed to fetch questions'
          });

        case 18:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[2, 14]]);
});
var PublicView = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: String
  },
  date: Date,
  Time: Date
});
var Public = mongoose.model('Publicview', PublicView);
var activeUsers = {};
io.on('connection', function _callee21(socket) {
  var userId, userToken, userName, user, messages;
  return regeneratorRuntime.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          console.log('A user is connected');
          userId = socket.handshake.query.token;
          userToken = socket.handshake.query.tokens;
          userName = socket.handshake.query.names;
          console.log(userId, userToken);
          _context21.prev = 5;
          _context21.next = 8;
          return regeneratorRuntime.awrap(UserRegs.findOne({
            Tokens: userToken,
            Email: userId
          }).populate('Fullname'));

        case 8:
          user = _context21.sent;

          if (!user) {
            _context21.next = 24;
            break;
          }

          console.log(userName, ' connected');
          io.emit('user connected', userName); // Load messages

          _context21.next = 14;
          return regeneratorRuntime.awrap(Public.find());

        case 14:
          messages = _context21.sent;
          socket.emit('loadMessages', messages); // Handle sending messages

          socket.on('sendMessage', function (messageData) {
            var newMessage = new Public({
              text: messageData.text,
              sender: messageData.sender,
              date: Date.now()
            });
            newMessage.save().then(function (savedMessage) {
              io.emit('newMessage', savedMessage);
            })["catch"](function (error) {
              console.error('Error saving message', error);
            });
          }); // Handle screen sharing

          socket.on('startScreenSharing', function (stream) {
            socket.broadcast.emit('sharedScreen', stream);
          });
          socket.on('stopScreenSharing', function () {
            socket.broadcast.emit('sharedScreen', null);
          }); // Handle typing

          socket.on('typing', function () {
            socket.broadcast.emit('typing');
          }); // Handle user activity

          socket.on('User active', function (userId) {
            activeUsers[userId] = true;
            io.emit('activeUsers', Object.keys(activeUsers));
          }); // Handle disconnection

          socket.on('disconnect', function () {
            console.log('A user disconnected');
            delete activeUsers[socket.id];
            io.emit('activeUsers', Object.keys(activeUsers));
          });
          _context21.next = 25;
          break;

        case 24:
          throw new Error('User not found');

        case 25:
          _context21.next = 31;
          break;

        case 27:
          _context21.prev = 27;
          _context21.t0 = _context21["catch"](5);
          console.log(_context21.t0.message);
          socket.disconnect(true);

        case 31:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[5, 27]]);
});
app.post('/publicview', function _callee22(req, res) {
  var message;
  return regeneratorRuntime.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          message = req.body.message;
          console.log(message);
          _context22.next = 4;
          return regeneratorRuntime.awrap(Public.create({
            text: message,
            date: Date.now(),
            time: Date.now()
          }).then(function () {
            res.json('Message sent to the public');
          })["catch"](function (err) {
            res.status(500).send({
              error: 'Internal application error'
            });
            console.error(err);
          }));

        case 4:
        case "end":
          return _context22.stop();
      }
    }
  });
});
app.get('/publicView', function _callee23(req, res) {
  var messages;
  return regeneratorRuntime.async(function _callee23$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          _context23.next = 3;
          return regeneratorRuntime.awrap(Public.find({}));

        case 3:
          messages = _context23.sent;

          if (!messages) {
            _context23.next = 8;
            break;
          }

          return _context23.abrupt("return", res.json(messages));

        case 8:
          return _context23.abrupt("return", res.json('No message found'));

        case 9:
          _context23.next = 15;
          break;

        case 11:
          _context23.prev = 11;
          _context23.t0 = _context23["catch"](0);
          console.log(_context23.t0);
          res.status(500).send({
            error: 'Internal application error'
          });

        case 15:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
app["delete"]('/tasks/:taskId', function _callee24(req, res) {
  var taskId, deleteTask;
  return regeneratorRuntime.async(function _callee24$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          taskId = req.params.taskId;
          _context24.prev = 1;
          _context24.next = 4;
          return regeneratorRuntime.awrap(Question.findByIdAndDelete(taskId));

        case 4:
          deleteTask = _context24.sent;

          if (deleteTask) {
            _context24.next = 7;
            break;
          }

          return _context24.abrupt("return", res.status(404).json({
            message: 'Task not found'
          }));

        case 7:
          res.status(200).json({
            message: 'Task deleted successfully'
          });
          _context24.next = 14;
          break;

        case 10:
          _context24.prev = 10;
          _context24.t0 = _context24["catch"](1);
          console.error('Error deleting task', _context24.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 14:
        case "end":
          return _context24.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
app.get('/tasks/:taskId', function _callee25(req, res) {
  var taskId, Task;
  return regeneratorRuntime.async(function _callee25$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          taskId = req.params.taskId;
          console.log(taskId);
          _context25.prev = 2;
          _context25.next = 5;
          return regeneratorRuntime.awrap(Question.find({
            Token: taskId
          }));

        case 5:
          Task = _context25.sent;

          if (Task) {
            _context25.next = 8;
            break;
          }

          return _context25.abrupt("return", res.status(404).json({
            message: 'Task not found'
          }));

        case 8:
          res.json(Task);
          _context25.next = 15;
          break;

        case 11:
          _context25.prev = 11;
          _context25.t0 = _context25["catch"](2);
          console.error('Error exploring task', _context25.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 15:
        case "end":
          return _context25.stop();
      }
    }
  }, null, null, [[2, 11]]);
});
var userReg = new mongoose.Schema({
  Fullname: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  regNo: {
    String: String
  },
  Tokens: {
    type: String,
    required: true
  },
  code: String,
  date: String
});
var UserRegs = mongoose.model('UserClients', userReg);
app.post('/userReg', function _callee26(req, res) {
  var _req$body13, Fullname, Email, regNo, code, Tokens, findExam;

  return regeneratorRuntime.async(function _callee26$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          _req$body13 = req.body, Fullname = _req$body13.Fullname, Email = _req$body13.Email, regNo = _req$body13.regNo, code = _req$body13.code, Tokens = _req$body13.Tokens;
          _context26.next = 3;
          return regeneratorRuntime.awrap(UserRegs.find({
            Email: Email,
            Tokens: Tokens
          }));

        case 3:
          findExam = _context26.sent;
          _context26.next = 6;
          return regeneratorRuntime.awrap(UserRegs.create({
            Fullname: Fullname,
            Email: Email,
            regNo: regNo,
            code: code,
            Tokens: Tokens,
            date: Date.now()
          }).then(function () {
            res.json('User registred');
          })["catch"](function (error) {
            console.log(error);
            res.status(500).send({
              error: 'Internal application error'
            });
          }));

        case 6:
        case "end":
          return _context26.stop();
      }
    }
  });
});
app.get('/ExamUser', function _callee27(req, res) {
  var Token, Section;
  return regeneratorRuntime.async(function _callee27$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          Token = req.headers.tokens;
          console.log(Token);
          _context27.prev = 2;
          _context27.next = 5;
          return regeneratorRuntime.awrap(Question.find({
            Token: Token
          }));

        case 5:
          Section = _context27.sent;

          if (!Section) {
            _context27.next = 10;
            break;
          }

          return _context27.abrupt("return", res.json(Section));

        case 10:
          return _context27.abrupt("return", res.status(400).send({
            error: 'No question found under this account'
          }));

        case 11:
          _context27.next = 17;
          break;

        case 13:
          _context27.prev = 13;
          _context27.t0 = _context27["catch"](2);
          console.log('Failed to fetch data');
          res.status(500).send({
            error: 'Failed to fetch questions'
          });

        case 17:
        case "end":
          return _context27.stop();
      }
    }
  }, null, null, [[2, 13]]);
});
app.get('/minsUser', function _callee28(req, res) {
  var Token, Minutes;
  return regeneratorRuntime.async(function _callee28$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          Token = req.headers.tokens;
          console.log(Token);
          _context28.prev = 2;
          _context28.next = 5;
          return regeneratorRuntime.awrap(Exam.find({
            creator_id: Token
          }));

        case 5:
          Minutes = _context28.sent;

          if (!Minutes) {
            _context28.next = 8;
            break;
          }

          return _context28.abrupt("return", res.json(Minutes));

        case 8:
          _context28.next = 14;
          break;

        case 10:
          _context28.prev = 10;
          _context28.t0 = _context28["catch"](2);
          console.log(_context28.t0);
          res.status(500).send({
            error: 'Internal applilcation error'
          });

        case 14:
        case "end":
          return _context28.stop();
      }
    }
  }, null, null, [[2, 10]]);
});
app.post('/usersolution', function _callee29(req, res) {
  var _req$body14, email, Names, Token, responses, submittedResponse, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step2$value, question_id, response, newResponse, savedResponse;

  return regeneratorRuntime.async(function _callee29$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _req$body14 = req.body, email = _req$body14.email, Names = _req$body14.Names, Token = _req$body14.Token, responses = _req$body14.responses;
          console.log(email, Names, Token);
          submittedResponse = [];
          _context29.prev = 3;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context29.prev = 7;
          _iterator2 = responses[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context29.next = 19;
            break;
          }

          _step2$value = _step2.value, question_id = _step2$value.question_id, response = _step2$value.response;
          newResponse = new Response({
            email: email,
            Names: Names,
            answers: {
              question_id: question_id,
              response: response,
              Mark: 0
            },
            Token: Token
          });
          _context29.next = 14;
          return regeneratorRuntime.awrap(newResponse.save());

        case 14:
          savedResponse = _context29.sent;
          submittedResponse.push(savedResponse);

        case 16:
          _iteratorNormalCompletion2 = true;
          _context29.next = 9;
          break;

        case 19:
          _context29.next = 25;
          break;

        case 21:
          _context29.prev = 21;
          _context29.t0 = _context29["catch"](7);
          _didIteratorError2 = true;
          _iteratorError2 = _context29.t0;

        case 25:
          _context29.prev = 25;
          _context29.prev = 26;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 28:
          _context29.prev = 28;

          if (!_didIteratorError2) {
            _context29.next = 31;
            break;
          }

          throw _iteratorError2;

        case 31:
          return _context29.finish(28);

        case 32:
          return _context29.finish(25);

        case 33:
          return _context29.abrupt("return", res.status(201).json({
            message: 'Submitted'
          }));

        case 36:
          _context29.prev = 36;
          _context29.t1 = _context29["catch"](3);
          console.error('Error submitting', _context29.t1);
          return _context29.abrupt("return", res.status(500).json({
            message: 'Internal application error'
          }));

        case 40:
        case "end":
          return _context29.stop();
      }
    }
  }, null, null, [[3, 36], [7, 21, 25, 33], [26,, 28, 32]]);
});
app.get('/question_usersolution', function _callee30(req, res) {
  var emails, Name, Token;
  return regeneratorRuntime.async(function _callee30$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          emails = req.headers.email;
          Name = req.headers.name;
          Token = req.headers.tokens;
          console.log(Token, emails, Name);
          _context30.next = 6;
          return regeneratorRuntime.awrap(Question.find({
            Token: Token
          }).then(function (questions) {
            Response.find({
              email: emails,
              Names: Name,
              Token: Token
            }).then(function (responses) {
              var questionSolutions = questions.map(function (question) {
                var matchedResponse = responses.find(function (response) {
                  return response.answers.some(function (answer) {
                    return answer.question_id.toString() === question._id.toString() && answer.response === question.correct_option;
                  });
                });
                var solution = {
                  question_id: question._id,
                  question_text: question.question_text,
                  options: question.options,
                  solution: question.correct_option,
                  status: matchedResponse ? 'green' : 'red'
                };
                return solution;
              });
              res.json(questionSolutions);
            })["catch"](function (err) {
              console.error('Error occured', err);
              res.status(500).json({
                error: 'Internal application error'
              });
            })["catch"](function (err) {
              console.log('error again', err);
              res.status(500).json({
                error: 'Internal server error'
              });
            });
          }));

        case 6:
        case "end":
          return _context30.stop();
      }
    }
  });
});
app.get('/userscores', function _callee31(req, res) {
  var emails, Name, tokens;
  return regeneratorRuntime.async(function _callee31$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          emails = req.headers.email;
          Name = req.headers.name;
          tokens = req.headers.tokens;
          Response.find({
            email: emails,
            Names: Name,
            Token: tokens
          }).then(function (responses) {
            Question.find({
              Token: tokens
            }).then(function (questions) {
              var totalScore = 0;
              var scores = responses.forEach(function (response) {
                var userScore = response.answers.reduce(function (totalScore, answer) {
                  var question = questions.find(function (q) {
                    return q._id.equals(answer.question_id);
                  });

                  if (question && question.correct_option === answer.response) {
                    answer.Mark = 1;
                    return totalScore + 1;
                  } else {
                    answer.mark = 0;
                    return totalScore;
                  }
                }, 0);
                Response.findByIdAndUpdate(response._id, response, {
                  "new": true
                }).then(function () {
                  console.log('Updated');
                })["catch"](function (error) {
                  console.error(error);
                });
                totalScore += userScore;
                return {
                  user_id: response._id,
                  score: userScore
                };
              });
              res.json({
                totalScore: totalScore
              });
              console.log(scores);
              Markpaper.create({
                email: emails,
                Names: Name,
                Token: tokens,
                totalmark: totalScore
              });
            })["catch"](function (err) {
              console.error('Error', err);
              res.status(500).json({
                error: 'Server error'
              });
            });
          })["catch"](function (err) {
            console.error('Error again', err);
            res.status(500).json({
              error: 'Server error'
            });
          });

        case 4:
        case "end":
          return _context31.stop();
      }
    }
  });
});
app.get('/userDid/:tasksId', function _callee32(req, res) {
  var tasksId, UserDid;
  return regeneratorRuntime.async(function _callee32$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          tasksId = req.params.tasksId;
          console.log(tasksId);
          _context32.prev = 2;
          _context32.next = 5;
          return regeneratorRuntime.awrap(Response.find({
            Token: tasksId
          }).distinct('Names'));

        case 5:
          UserDid = _context32.sent;

          if (!UserDid) {
            _context32.next = 8;
            break;
          }

          return _context32.abrupt("return", res.json(UserDid));

        case 8:
          _context32.next = 14;
          break;

        case 10:
          _context32.prev = 10;
          _context32.t0 = _context32["catch"](2);
          console.log('Internal application error', _context32.t0);
          res.status(500).send({
            error: 'Internal application error'
          });

        case 14:
        case "end":
          return _context32.stop();
      }
    }
  }, null, null, [[2, 10]]);
});
app.get('/all/:name/:token', function _callee33(req, res) {
  var name, token;
  return regeneratorRuntime.async(function _callee33$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          name = req.params.name;
          token = req.params.token;
          console.log(name);
          console.log(token);
          _context33.next = 6;
          return regeneratorRuntime.awrap(Question.find({
            Token: token
          }).then(function (questions) {
            Response.find({
              Names: name,
              Token: token
            }).then(function (responses) {
              var questionSolutions = questions.map(function (question) {
                var matchedResponse = responses.find(function (response) {
                  return response.answers.some(function (answer) {
                    return answer.question_id.toString() === question._id.toString() && answer.response === question.correct_option;
                  });
                });
                var solution = {
                  question_id: question._id,
                  question_text: question.question_text,
                  options: question.options,
                  solution: question.correct_option,
                  status: matchedResponse ? 'green' : 'red'
                };
                return solution;
              });
              res.json(questionSolutions);
            })["catch"](function (err) {
              console.error('Error occured', err);
              res.status(500).json({
                error: 'Internal application error'
              });
            })["catch"](function (err) {
              console.log('error again', err);
              res.status(500).json({
                error: 'Internal server error'
              });
            });
          }));

        case 6:
        case "end":
          return _context33.stop();
      }
    }
  });
});
app.get('/studentmarks/:tokens', function _callee34(req, res) {
  var tokens, Marks;
  return regeneratorRuntime.async(function _callee34$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          tokens = req.params.tokens;
          console.log('this your token', tokens);
          _context34.prev = 2;
          _context34.next = 5;
          return regeneratorRuntime.awrap(Markpaper.find({
            Token: tokens
          }));

        case 5:
          Marks = _context34.sent;

          if (!Marks) {
            _context34.next = 10;
            break;
          }

          return _context34.abrupt("return", res.json(Marks));

        case 10:
          return _context34.abrupt("return", res.status(404).json({
            error: 'Not found'
          }));

        case 11:
          _context34.next = 17;
          break;

        case 13:
          _context34.prev = 13;
          _context34.t0 = _context34["catch"](2);
          console.log(_context34.t0);
          res.status(500).send({
            error: 'Internal application error'
          });

        case 17:
        case "end":
          return _context34.stop();
      }
    }
  }, null, null, [[2, 13]]);
});
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

server.listen(port, function () {
  console.log("The server is running on port ".concat(port));
});