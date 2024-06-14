import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;

//24/06/13
// {name: 'TTFB', value: 10.400000095367432, rating: 'good', delta: 10.400000095367432, entries: Array(1), …}
// {name: 'FCP', value: 654.5, rating: 'good', delta: 654.5, entries: Array(1), …}


// lazy loading at app.jsx
// {name: 'TTFB', value: 6.599999904632568, rating: 'good', delta: 6.599999904632568, entries: Array(1), …}
// {name: 'FCP', value: 389.40000009536743, rating: 'good', delta: 389.40000009536743, entries: Array(1), …}



// Otimização de Recursos Críticos:

// Priorize o carregamento dos recursos críticos da página, como CSS e JavaScript necessários para renderizar o conteúdo inicial. Isso pode ser feito usando técnicas como inline CSS crítico e carregamento assíncrono de JavaScript não essencial.
// Minificação e Compactação de Recursos:

// Reduza o tamanho dos arquivos CSS, JavaScript e imagens por meio de minificação (remoção de espaços em branco, comentários) e compactação (compressão de imagens sem perda de qualidade).
// Lazy Loading de Recursos Não Essenciais:

// Adote o lazy loading para imagens, vídeos e outros recursos não essenciais que não são visíveis na tela inicialmente. Isso reduzirá a carga inicial da página.
// Carregamento Assíncrono de Recursos:

// Carregue recursos não críticos de forma assíncrona, permitindo que o navegador renderize o conteúdo principal da página sem esperar pelo carregamento de recursos secundários.