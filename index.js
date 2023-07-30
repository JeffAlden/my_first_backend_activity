
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; 


const Books = [
  {
    id: 1,
    BookName: 'PHP 8',
    YearPublished: '2023',
    Author: 'VicS',
    Category: 'Web',
    status: 1,
  },
  {
    id: 2,
    BookName: 'React.js',
    YearPublished: '2000',
    Author: 'Peter SMith',
    Category: 'Web',
    status: 1,
  },
  {
    id: 3,
    BookName: "CSS framework",
    YearPublished: "2005",
    Author: "Jaguar",
    Category: "Web",
    status: 1,
  },
  {
   id: 4,
   BookName: "Data Science",
   YearPublished: "2023",
   Author: "Vic S",
   Category: "Data",
   status: 1,
  },
  
];

// LoginProfiles
const LoginProfiles = [
  {
    id: 1,
    username: 'admin',
    password: 'passwd123',
    isAdmin: true,
  },
  {
    id: 2,
    username: 'staff',
    password: '123456',
    isAdmin: false,
  },
  {
    id: 3,
    username: "vice",
    password: "abrakadabra",
    isAdmin: false,
},
{
    id: 4,
    username: "super",
    password: "69843",
    isAdmin: true,
},
{
    id: 5,
    username: "user",
    password: "123",
    isAdmin: false,
},
  
];


const secretKey = 'your-secret-key';

// Middleware to parse 
app.use(bodyParser.json());

// Middleware to enable CORS 
app.use(cors());

// Endpoint to return all books
app.get('/books', (req, res) => {
  res.json(Books);
});

// Endpoint to get book details by Id
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = Books.find((book) => book.id === bookId);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

// Login endpoint to generate JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  
  const user = LoginProfiles.find(
    (profile) => profile.username === username && profile.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a JWT token a
  const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, secretKey, {
    expiresIn: '1h',
  });
  res.json({ token });
});

// Middleware 
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

//  protected endpoint
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected endpoint', user: req.user });
});

// Need to add
app.get('/', (req, res) => {
    res.send('Welcome to My First Backend Activity!');
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
