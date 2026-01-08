import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: SUPABASE_URL ou SERVICE_ROLE_KEY não encontrados no .env');
  process.exit(1);
}

// Criar cliente com Service Role (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const WORKSHOPS = [
  { name: 'Bahia Oficina', email: 'contato@bahiaoficina.com', uf: 'BA' },
  { name: 'Maceio Oficina', email: 'contato@maceiooficina.com', uf: 'AL' },
  { name: 'Minas Gerais Oficina', email: 'contato@minasoficina.com', uf: 'MG' },
  { name: 'Parana Oficina', email: 'contato@paranaoficina.com', uf: 'PR' },
  { name: 'Sao Paulo Oficina', email: 'contato@spoficina.com', uf: 'SP' },
];

const CAR_MODELS = [
  { model: 'Fiat Strada', year: 2022 },
  { model: 'Hyundai HB20', year: 2023 },
  { model: 'Chevrolet Onix', year: 2021 },
  { model: 'VW Polo', year: 2024 },
  { model: 'Jeep Compass', year: 2022 },
  { model: 'Toyota Corolla', year: 2020 },
  { model: 'Honda HR-V', year: 2021 },
  { model: 'Fiat Toro', year: 2023 },
  { model: 'Nissan Kicks', year: 2022 },
  { model: 'Renault Kwid', year: 2024 },
];

const SERVICE_TYPES = [
  { type: 'Troca de Óleo', price: 250, km: 10000 },
  { type: 'Revisão Geral', price: 800, km: 10000 },
  { type: 'Alinhamento e Balanceamento', price: 150, km: 5000 },
  { type: 'Troca de Pastilhas', price: 400, km: 30000 },
  { type: 'Limpeza de Ar Condicionado', price: 180, km: 15000 },
];

const CLIENT_NAMES = [
  'Carlos Silva', 'Ana Santos', 'Pedro Oliveira', 'Mariana Souza', 'João Ferreira',
  'Fernanda Costa', 'Lucas Pereira', 'Juliana Lima', 'Marcos Rocha', 'Beatriz Alves'
];

async function seed() {
  console.log('🚀 Iniciando Seed do Banco de Dados...');

  for (const workshop of WORKSHOPS) {
    console.log(`\n🏢 Criando Oficina: ${workshop.name}...`);

    // 1. Criar Oficina (se não existir, cria; se existir, pega ID)
    let oficinaId: string;
    
    const { data: existingOficina } = await supabase
      .from('oficinas')
      .select('id')
      .eq('email', workshop.email)
      .single();

    if (existingOficina) {
      oficinaId = existingOficina.id;
      console.log(`   ✅ Oficina já existe (ID: ${oficinaId})`);
    } else {
      const { data: newOficina, error } = await supabase
        .from('oficinas')
        .insert({
          nome: workshop.name,
          email: workshop.email,
          senha_hash: '$2a$10$abcdefghijklmnopqrstuv' // Hash fictício para cumprir constraint
        })
        .select('id')
        .single();

      if (error) {
        console.error(`   ❌ Erro ao criar oficina: ${error.message}`);
        continue;
      }
      oficinaId = newOficina.id;
      console.log(`   ✅ Oficina criada com sucesso (ID: ${oficinaId})`);
    }

    // 2. Criar Clientes e Carros
    console.log(`   👥 Criando 10 Clientes e Veículos...`);
    
    for (let i = 0; i < 10; i++) {
      const clientName = `${CLIENT_NAMES[i]} (${workshop.uf})`;
      const car = CAR_MODELS[i];
      
      const { data: newClient, error: clientError } = await supabase
        .from('clientes')
        .insert({
          oficina_id: oficinaId,
          nome: clientName,
          whatsapp: `1199999${Math.floor(1000 + Math.random() * 9000)}`, // Telefone fictício
          carro: car.model,
          ano_carro: car.year,
          placa: `ABC-${Math.floor(1000 + Math.random() * 9000)}`,
          km_carro: Math.floor(50000 + Math.random() * 50000)
        })
        .select('id')
        .single();

      if (clientError) {
        console.error(`      ❌ Erro ao criar cliente ${clientName}: ${clientError.message}`);
        continue;
      }

      // 3. Criar Serviços para o Cliente
      // Criar 1 a 3 serviços passados
      const numServices = Math.floor(1 + Math.random() * 3);
      for (let j = 0; j < numServices; j++) {
        const serviceType = SERVICE_TYPES[Math.floor(Math.random() * SERVICE_TYPES.length)];
        const dateOffset = Math.floor(Math.random() * 180); // Dias atrás
        const serviceDate = new Date();
        serviceDate.setDate(serviceDate.getDate() - dateOffset);
        
        const kmRealizado = 50000 + (j * 10000);

        const { error: serviceError } = await supabase
          .from('servicos')
          .insert({
            oficina_id: oficinaId,
            cliente_id: newClient.id,
            tipo_servico: serviceType.type,
            data_servico: serviceDate.toISOString(),
            km_na_data: kmRealizado,
            valor: serviceType.price,
            descricao: 'Serviço realizado com sucesso. Cliente satisfeito.',
            proxima_manutencao_km: kmRealizado + serviceType.km,
            proxima_manutencao_dias: 180
          });

        if (serviceError) console.error(`      ❌ Erro ao criar serviço: ${serviceError.message}`);
      }

      // 4. Criar Mensagem de WhatsApp (Simulação de Gestão)
      const { error: msgError } = await supabase
        .from('mensagens_whatsapp')
        .insert({
          oficina_id: oficinaId,
          cliente_id: newClient.id,
          tipo_mensagem: i % 2 === 0 ? 'lembrete' : 'promocao',
          mensagem: `Olá ${clientName}, aqui é da ${workshop.name}. Sua revisão está próxima!`,
          status: i % 3 === 0 ? 'enviado' : 'pendente',
          numero_destino: `1199999${Math.floor(1000 + Math.random() * 9000)}`,
          numero_whatsapp_origem: '11988887777'
        });
      
      if (msgError) console.error(`      ❌ Erro ao criar mensagem: ${msgError.message}`);
    }
  }

  console.log('\n✨ Seed Concluído! Banco de dados populado com sucesso.');
}

seed().catch(console.error);
