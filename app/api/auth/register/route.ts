import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password, nome } = await req.json();

    if (!email || !password || !nome) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('oficinas')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('oficinas')
      .insert({ email, senha_hash: hashedPassword, nome })
      .select()
      .single();

    if (error) throw error;

    // Login automático
    const token = signToken({ id: newUser.id, email: newUser.email });

    const response = NextResponse.json({ user: newUser });
    response.cookies.set('token', token, { httpOnly: true, path: '/' });

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
