// Rode uma vez, localmente: node scripts/get-google-refresh-token.js
// Pré-requisito: GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET já no .env.local (ver docs/08-agendamento-setup.md).
// Gera o GOOGLE_REFRESH_TOKEN pra colar no .env.local — depois disso o script não precisa rodar de novo.

const fs = require('fs');
const path = require('path');
const http = require('http');
const { google } = require('googleapis');

const envPath = path.join(__dirname, '..', '.env.local');

function loadEnv() {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) process.env[key] = value;
    }
  });
}
loadEnv();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const PORT = 3939;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '\nFaltam GOOGLE_CLIENT_ID e/ou GOOGLE_CLIENT_SECRET no .env.local.\n' +
      'Cria as credenciais OAuth no Google Cloud Console primeiro — passo a passo em docs/08-agendamento-setup.md.\n',
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/calendar.events'],
});

console.log('\nAbra esse link no navegador, logado na conta Google que vai receber os agendamentos:\n');
console.log(authUrl);
console.log('\nAguardando autorização...\n');

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) {
    res.writeHead(404);
    res.end();
    return;
  }

  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');

  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Faltou o código na URL de retorno.</h1>');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Autorizado! Pode fechar essa aba e voltar pro terminal.</h1>');

    if (tokens.refresh_token) {
      console.log('\n✅ Refresh token gerado — cola isso em GOOGLE_REFRESH_TOKEN no .env.local:\n');
      console.log(tokens.refresh_token);
      console.log('');
    } else {
      console.log(
        '\n⚠️  Nenhum refresh_token veio na resposta (normalmente acontece se essa conta já autorizou esse app antes).\n' +
          'Revoga o acesso em https://myaccount.google.com/permissions e roda o script de novo.\n',
      );
    }
  } catch (error) {
    console.error('\nErro trocando o código pelo token:', error.message, '\n');
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Erro — olha o terminal.</h1>');
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(PORT, () => {
  console.log(`Servidor local esperando o redirect em ${REDIRECT_URI}`);
});
