import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signToken } from '@/lib/jwt';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { oficinaId } = body;

    if (!oficinaId) {
      return NextResponse.json({ error: 'ID da oficina obrigatório' }, { status: 400 });
    }

    // Buscar dados da oficina para garantir que existe
    const { data: oficina, error } = await supabaseAdmin
      .from('oficinas')
      .select('*')
      .eq('id', oficinaId)
      .single();

    if (error || !oficina) {
      return NextResponse.json({ error: 'Oficina não encontrada' }, { status: 404 });
    }

    // Gerar token JWT válido para esta oficina
    const token = signToken({
      id: oficina.id,
      email: oficina.email,
      nome: oficina.nome,
      oficina_id: oficina.id
    });

    // Definir cookie de autenticação (substituindo o do admin)
    const response = NextResponse.json({ 
      success: true, 
      redirectUrl: '/dashboard',
      oficina: {
        id: oficina.id,
        nome: oficina.nome,
        email: oficina.email
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 dia
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}