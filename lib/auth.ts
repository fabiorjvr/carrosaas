import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
}
