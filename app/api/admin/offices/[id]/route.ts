import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Buscar clientes da oficina
    const { data: clientes, error: clientesError } = await supabaseAdmin
      .from('clientes')
      .select('*')
      .eq('oficina_id', id)
      .order('criado_em', { ascending: false });

    if (clientesError) throw clientesError;

    // Buscar serviços recentes
    const { data: servicos, error: servicosError } = await supabaseAdmin
      .from('servicos')
      .select('*')
      .eq('oficina_id', id)
      .order('data_servico', { ascending: false })
      .limit(50);
    
    if (servicosError) throw servicosError;

    // Buscar estatísticas de mensagens
    const { count: mensagensCount } = await supabaseAdmin
      .from('mensagens_whatsapp')
      .select('*', { count: 'exact', head: true })
      .eq('oficina_id', id);

    return NextResponse.json({
      clientes: clientes || [],
      ultimos_servicos: servicos || [],
      total_mensagens: mensagensCount || 0
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
