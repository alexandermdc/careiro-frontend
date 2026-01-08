# Projeto Feira Online

Este é um projeto de feira online desenvolvido pelo **ICE Itacoatiara** da **UFAM**, em parceria com o **ICOMP**. O objetivo é criar uma plataforma moderna para conectar feirantes e consumidores, facilitando a compra e venda de produtos locais de forma prática e segura.

---
## Git Hub do BackEnd
```
https://github.com/alexandermdc/CareiroBackeEnd
```

## Tecnologias Utilizadas

- **React**
- **TypeScript**
- **Vite**

---

## Como Executar o Projeto

1. Clone o repositório:
  ```bash
  git clone https://github.com/seu-usuario/projetocareiro-frontend.git
  ```
2. Instale as dependências:
  ```bash
  npm install
  ```
3. Inicie o servidor de desenvolvimento:
  ```bash
  npm run dev
  ```

---

## Estrutura do Projeto

```
careiro-frontend/
│
├── public/                      # Arquivos estáticos públicos
│   └── img/                     # Imagens públicas da aplicação
│
├── src/                         # Código-fonte da aplicação
│   ├── assets/                  # Recursos estáticos (imagens, fontes, ícones)
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   ├── badge.tsx           # Componente de badge/etiqueta
│   │   ├── bradcrumb.tsx       # Componente de navegação breadcrumb
│   │   ├── button.tsx          # Componentes de botão
│   │   ├── cards.tsx           # Componentes de cards
│   │   ├── Carousel.tsx        # Carrossel de imagens
│   │   ├── FooterSection.tsx   # Rodapé da aplicação
│   │   ├── HeaderSection.tsx   # Cabeçalho da aplicação
│   │   ├── ImageUpload.tsx     # Upload de imagens
│   │   ├── inputs.tsx          # Componentes de input/formulário
│   │   ├── Modal.tsx           # Componente de modal
│   │   ├── navigate_menu.tsx   # Menu de navegação
│   │   ├── PageLayout.tsx      # Layout padrão das páginas
│   │   ├── ProtectedRoute.tsx  # Proteção de rotas autenticadas
│   │   └── SeletorPapel.tsx    # Seletor de papel/perfil do usuário
│   │
│   ├── config/                  # Configurações da aplicação
│   │
│   ├── contexts/                # Contextos React (gerenciamento de estado global)
│   │   ├── AuthContext.tsx     # Contexto de autenticação
│   │   ├── BuscaContext.tsx    # Contexto de busca
│   │   ├── CarrinhoContext.tsx # Contexto do carrinho de compras
│   │   └── FavoritosContext.tsx# Contexto de favoritos
│   │
│   ├── hooks/                   # Custom hooks React
│   │   └── useCPFInput.ts      # Hook para input de CPF
│   │
│   ├── lib/                     # Bibliotecas e utilitários auxiliares
│   │   ├── button-variants.ts  # Variantes de estilos para botões
│   │   ├── navigation-styles.ts# Estilos de navegação
│   │   └── utils.ts            # Funções utilitárias gerais
│   │
│   ├── pages/                   # Páginas da aplicação
│   │   ├── admin/              # Páginas administrativas
│   │   │   ├── GerenciarAssociacoes.tsx
│   │   │   └── PainelAdmin.tsx
│   │   ├── associacao/         # Páginas de associação
│   │   │   ├── Associacao.tsx
│   │   │   ├── CadastroAssociacao.tsx
│   │   │   └── Sections/
│   │   ├── associacoes/        # Listagem de associações
│   │   ├── busca/              # Página de resultados de busca
│   │   ├── cadastro/           # Página de cadastro de usuário
│   │   ├── carrinho/           # Página do carrinho de compras
│   │   ├── checkout/           # Página de finalização de pedido
│   │   ├── dashboard/          # Dashboard do usuário
│   │   ├── favoritos/          # Página de produtos favoritos
│   │   ├── feiras/             # Páginas relacionadas a feiras
│   │   ├── homepage/           # Página inicial
│   │   ├── login/              # Páginas de login
│   │   ├── pagamento/          # Páginas de retorno de pagamento
│   │   ├── pedidos/            # Página de pedidos do usuário
│   │   ├── perfil/             # Página de perfil do usuário
│   │   ├── produtores/         # Páginas de produtores
│   │   ├── produtos/           # Páginas de produtos
│   │   ├── sobrenos/           # Página sobre nós
│   │   └── vendedor/           # Páginas do vendedor
│   │
│   ├── services/                # Serviços de comunicação com API
│   │   ├── api.ts              # Configuração base da API
│   │   ├── associacaoService.ts# Serviço de associações
│   │   ├── authService.ts      # Serviço de autenticação
│   │   ├── categoriaService.ts # Serviço de categorias
│   │   ├── clienteService.ts   # Serviço de clientes
│   │   ├── feiraService.ts     # Serviço de feiras
│   │   ├── pagamentoService.ts # Serviço de pagamentos
│   │   ├── pedidoService.ts    # Serviço de pedidos
│   │   ├── produtoService.ts   # Serviço de produtos
│   │   └── vendedorService.ts  # Serviço de vendedores
│   │
│   ├── types/                   # Definições de tipos TypeScript
│   │   └── pagamento.ts        # Tipos relacionados a pagamento
│   │
│   ├── utils/                   # Funções utilitárias
│   │   ├── cpfValidator.ts     # Validador de CPF
│   │   └── logger.ts           # Utilitário de logs
│   │
│   ├── App.tsx                  # Componente principal da aplicação
│   ├── main.tsx                 # Ponto de entrada da aplicação
│   └── index.css                # Estilos globais
│
├── docker-compose.yml           # Configuração Docker Compose
├── Dockerfile                   # Configuração Docker
├── nginx.conf                   # Configuração Nginx
├── package.json                 # Dependências e scripts npm
├── vite.config.ts               # Configuração Vite
├── tailwind.config.js           # Configuração Tailwind CSS
├── tsconfig.json                # Configuração TypeScript
└── README.md                    # Documentação do projeto
```

### Descrição das Principais Pastas

#### `/src/components`
Contém todos os componentes reutilizáveis da aplicação, como botões, cards, modais, cabeçalho, rodapé e outros elementos de UI que são compartilhados entre diferentes páginas.

#### `/src/contexts`
Armazena os contextos React que gerenciam o estado global da aplicação, incluindo autenticação, carrinho de compras, favoritos e busca.

#### `/src/pages`
Organiza todas as páginas da aplicação por funcionalidade. Cada pasta representa uma área específica do sistema (admin, vendedor, cliente, etc.).

#### `/src/services`
Contém os serviços responsáveis pela comunicação com a API backend. Cada service agrupa as chamadas relacionadas a uma entidade específica.

#### `/src/hooks`
Custom hooks React que encapsulam lógica reutilizável, como manipulação de inputs e validações.

#### `/src/lib`
Bibliotecas auxiliares e funções utilitárias que são usadas em toda a aplicação.

#### `/src/types`
Definições de tipos e interfaces TypeScript para garantir type-safety na aplicação.

#### `/src/utils`
Funções utilitárias gerais, como validadores e helpers diversos.

---


## Licença

Este projeto está licenciado sob a licença MIT.
