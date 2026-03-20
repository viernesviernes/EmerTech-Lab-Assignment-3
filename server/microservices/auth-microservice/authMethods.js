const jwt = require('jsonwebtoken');
require('dotenv').config();

const COOKIE_NAME = process.env.COOKIE_NAME || "";
console.log("DId the env work? ", COOKIE_NAME);

const SECRET = process.env.SESSION_SECRET || "";
const MAX_AGE_SEC = 1 * 60 * 60;


function sign(payload) {
  if (!SECRET) throw new Error('SESSION_SECRET or sessionSecret required');
  return jwt.sign(payload, SECRET, { expiresIn: MAX_AGE_SEC });
}

function getUserIdFromToken(context) {
  console.log("Context: ", context.req.cookies);
  const token = context.req.cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded.id;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
}


function setTokenCookie(res, payload) {
    const token = sign(payload);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SEC * 1000,
  });
}

function clearCookie(res){
    res.clearCookie(COOKIE_NAME);
}

module.exports = {
    setTokenCookie,
    clearCookie,
    getUserIdFromToken
};