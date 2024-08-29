# 🌊 Hydro Station Data

O **Hydro Station Data** é um projeto dedicado a fornecer informações detalhadas sobre condições hidrológicas e meteorológicas, utilizando dados coletados pela Rede Hidrometeorológica Nacional (RHN). Este projeto é essencial para o monitoramento de estações hidrológicas e meteorológicas, oferecendo dados sobre precipitação, níveis de água e outros parâmetros cruciais para a gestão de recursos hídricos.

## 🚀 Funcionalidades

- **Pesquisa de Estações**: Pesquise e filtre estações hidrológicas e meteorológicas utilizando diversos critérios.
- **Visualização de Dados**: Acesse visualizações detalhadas de dados sobre chuvas, níveis de água e outras medições hidrológicas.
- **Download de Dados**: Baixe os dados selecionados em formatos acessíveis como XLSX.
- **Visualização de Histórico**: Acesse dados históricos de precipitação e níveis de água de várias estações.
- **Interface Amigável**: Navegação intuitiva e design moderno para uma experiência de usuário agradável.

## 📦 Estrutura do Projeto

```bash
hydro-station-data/
├── public/              # Arquivos públicos como index.html
├── src/
│   ├── api/             # Serviços de API
│   ├── components/      # Componentes React
│   ├── context/         # Contextos globais (e.g., LoadingContext)
│   ├── utils/           # Utilitários e funções auxiliares
│   ├── App.js           # Componente principal da aplicação
│   ├── index.js         # Ponto de entrada da aplicação
│   └── styles.css       # Estilos globais
├── .gitignore           # Arquivos a serem ignorados pelo Git
├── package.json         # Dependências do projeto
└── README.md            # Documentação do projeto
```

## 🔧 Instalação e Configuração

### Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**

### Passos para Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/hydro-station-data.git
   ```

2. **Navegue até o diretório do projeto:**

   ```bash
   cd hydro-station-data
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   # ou
   yarn install
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm start
   # ou
   yarn start
   ```

5. **Acesse o aplicativo:**

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar o projeto em execução.

## 🧩 Componentes Principais

- **App.js**: Componente principal que configura as rotas e o contexto de carregamento.
- **HomePage**: Página inicial com informações sobre o aplicativo.
- **DataInputPage**: Página para pesquisa e filtragem de estações.
- **AllHydroDataPage**: Página para visualização de todos os dados hidrométricos.
- **StationDetailsPage**: Detalhes de uma estação específica, incluindo dados históricos e medições atuais.
- **PreviewModal**: Modal para pré-visualização dos dados antes do download.

## 🤝 Contribuições

Contribuições são sempre bem-vindas! Siga os passos abaixo para contribuir:

1. **Fork o repositório**.
2. **Crie uma nova branch** (`git checkout -b feature/nova-feature`).
3. **Faça suas alterações**.
4. **Commit suas alterações** (`git commit -m 'Adiciona nova funcionalidade'`).
5. **Push para a branch** (`git push origin feature/nova-feature`).
6. **Abra um Pull Request**.

## 📜 Licença

Este projeto é licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💡 Agradecimentos

- **Agência Nacional de Águas (ANA)** pela disponibilização dos dados.
- **React** por fornecer o framework para a interface de usuário.

---

*Este projeto não é afiliado oficialmente com o aplicativo HydroWeb Mobile ou com a Agência Nacional de Águas (ANA). Ele utiliza dados públicos para fins informativos e educacionais.*

