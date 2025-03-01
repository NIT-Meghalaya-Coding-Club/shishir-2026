// src/lib/auth.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function generateOrganizerToken(user) {
  return jwt.sign({ userId: user.eventCode }, SECRET_KEY, { expiresIn: '30d' });
}

export function generateToken(user) {
  return jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1h' });
}

export function generateUserToken(phone) {
  return jwt.sign( { phone }, SECRET_KEY, { expiresIn: '30d' } );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}
