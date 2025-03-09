# Physical Store API

Esta API permite aos usuários localizar lojas físicas dentro de um raio de 100km, ordenadas por proximidade, através da busca pelo CEP.

## Endpoints

### Encontrar as lojas mais próximas

- **Requisição**:

```
GET /api/stores/nearby?cep={CEP}
```

- **Parâmetro**:

  - `cep` (obrigatório): O CEP (no formato 00000-000) da localização do usuário.

- **Resposta**:

  - `200 OK`: Retorna as informações das lojas por ordem de proximidade.

  - `400 Bad Request`: Caso o CEP fornecido seja inválido.

  - `404 Not Found`: Caso nenhuma loja seja encontrada no raio de 100km.

  - `500 Internal Server Error`: Se ocorrer um erro no servidor.

### Exemplo de requisição:

```
GET /api/stores/nearby?cep=00000-000
```

## Tecnologias

- [TypeScript](https://www.typescriptlang.org)
- [Express.js](https://expressjs.com)
- [SQLite](https://github.com/TryGhost/node-sqlite3)
- [Winston](https://github.com/winstonjs/winston)

## Instalação

1. Clone o repositório

```bash
git clone https://github.com/marcoreliodev/desafio2-physical-store.git
cd desafio2-physical-store
```

2. Instale as dependências

```bash
npm install
```

4. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```ini
PORT=3333 # Porta do servidor (padrão: 3333)
VIACEP_API_URL=https://viacep.com.br/ws  # URL da API ViaCEP
NOMINATIM_API_URL=https://nominatim.openstreetmap.org/search  # URL da API Nominatim
OSRM_API_URL=http://router.project-osrm.org/route/v1/driving  # URL da API OSRM
```

3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```
