import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) {
  throw new Error('JWT_SECRET ausente no .env');
}

const EXPIRES_IN = (process.env.JWT_EXPIRES ?? '1d') as SignOptions['expiresIn'];

export function signJwt(userId: string, email: string) {
  const payload = { email };
  const options: SignOptions = { subject: userId, expiresIn: EXPIRES_IN };
  return jwt.sign(payload, SECRET, options);
}

export function verifyJwtOrThrow(token: string) {
  const payload = jwt.verify(token, SECRET) as JwtPayload & { sub: string; email: string };
  return { id: String(payload.sub), email: String(payload.email) };
}
