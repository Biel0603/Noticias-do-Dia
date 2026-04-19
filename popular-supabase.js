/* ══════════════════════════════════════════
   popular-supabase.js
   Execute esse arquivo UMA VEZ para popular
   o banco de dados com as notícias iniciais.
   ══════════════════════════════════════════ */

const SUPABASE_URL = 'https://dehuemqkgzzxerudmboh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AopBZT46blAViq7aG_3e1Q_93hwYZq2';

const noticias = [
  {
    titulo: "Governo anuncia novo programa de investimento",
    descricao: "Medidas que devem impactar economia e mercado de trabalho nos próximos meses.",
    categoria: "politics",
    categoria_label: "Política",
    imagem: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80",
    tempo: "Há 2 horas",
    destaque: true
  },
  {
    titulo: "Mercado fecha em alta com expectativas positivas",
    descricao: "Índices encerram o dia em patamares recordes, puxados por ações do setor financeiro.",
    categoria: "economy",
    categoria_label: "Economia",
    imagem: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    tempo: "Há 3 horas",
    destaque: true
  },
  {
    titulo: "Startup brasileira recebe investimento recorde",
    descricao: "Empresa de inteligência artificial arrecada 50 milhões em rodada de financiamento.",
    categoria: "tech",
    categoria_label: "Tecnologia",
    imagem: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
    tempo: "Há 5 horas",
    destaque: true
  },
  {
    titulo: "Cúpula internacional discute questões climáticas",
    descricao: "Líderes mundiais se reúnem para discutir metas de redução de emissões.",
    categoria: "world",
    categoria_label: "Mundo",
    imagem: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80",
    tempo: "Há 30 min",
    destaque: false
  },
  {
    titulo: "Descoberta revolucionária em medicina regenerativa",
    descricao: "Pesquisadores desenvolvem novo tratamento para doenças degenerativas.",
    categoria: "science",
    categoria_label: "Ciência",
    imagem: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80",
    tempo: "Há 1 hora",
    destaque: false
  },
  {
    titulo: "Seleção brasileira vence amistoso preparatório",
    descricao: "Time enfrenta adversário europeu em jogo com grande movimentação no meio-campo.",
    categoria: "sports",
    categoria_label: "Esportes",
    imagem: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80",
    tempo: "Há 2 horas",
    destaque: false
  },
  {
    titulo: "Câmara aprova projeto de lei importante",
    descricao: "Legislativo valida proposta que tramitava há mais de um ano na casa.",
    categoria: "politics",
    categoria_label: "Política",
    imagem: "https://media.istockphoto.com/id/946578380/pt/foto/talking-to-audience.jpg?s=612x612&w=is&k=20&c=cNVD9Jj-Ze1oG2fQs2yK-MGHLp37hw_0ZtJXCD3GzoE=",
    tempo: "Há 3 horas",
    destaque: false
  },
  {
    titulo: "Dólar fecha em queda após decisão do BC",
    descricao: "Banco Central mantém taxa de juros e revisa projeções para inflação.",
    categoria: "economy",
    categoria_label: "Economia",
    imagem: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80",
    tempo: "Há 4 horas",
    destaque: false
  },
  {
    titulo: "Nova geração de processadores é apresentada",
    descricao: "Fabricante anuncia chips com 40% de ganho de performance energética.",
    categoria: "tech",
    categoria_label: "Tecnologia",
    imagem: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80",
    tempo: "Há 5 horas",
    destaque: false
  },
  {
    titulo: "Europa enfrenta clima extremo com geada",
    descricao: "Temperaturas recordes preocupam autoridades de diversos países europeus.",
    categoria: "world",
    categoria_label: "Mundo",
    imagem: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&q=80",
    tempo: "Há 6 horas",
    destaque: false
  },
  {
    titulo: "Astrônomos descobrem novo exoplaneta habitável",
    descricao: "Telescópio espacial detecta planeta em zona de habitabilidade de estrela distante.",
    categoria: "science",
    categoria_label: "Ciência",
    imagem: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80",
    tempo: "Há 7 horas",
    destaque: false
  }
];

async function popularBanco() {
  console.log('Iniciando inserção de notícias...');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/noticias`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(noticias)
  });

  if (res.ok) {
    console.log('✅ Todas as notícias foram inseridas com sucesso!');
  } else {
    const erro = await res.text();
    console.error('❌ Erro ao inserir notícias:', erro);
  }
}

popularBanco();
