import jwt from 'jsonwebtoken';

// verify JWT token
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; 
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
export const getAllSubjects = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'subject');
    const subjects = quizzes.map(q => q.subject);
    const uniqueSubjects = [...new Set(subjects)];
    res.json(uniqueSubjects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};



export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
