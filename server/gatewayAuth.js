const path = require('path');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const COOKIE_NAME = process.env.COOKIE_NAME || '';
const SECRET = process.env.SESSION_SECRET || '';

function getUserFromRequest(req) {
  if (!req?.cookies || !COOKIE_NAME || !SECRET) return null;

  const token = req.cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET);
    return { id: decoded.id, role: decoded.role };
  } catch (err) {
    console.error('Gateway: error verifying token:', err.message);
    return null;
  }
}


function getCookieHeaderForSubgraph(req) {
  if (!req?.cookies || !COOKIE_NAME) return null;
  const token = req.cookies[COOKIE_NAME];
  if (!token) return null;
  return `${COOKIE_NAME}=${token}`;
}

module.exports = {
  getUserFromRequest,
  getCookieHeaderForSubgraph,
};
