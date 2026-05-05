# ⚡ Pokédex Web - Projeto de Web II

Este projeto foi desenvolvido com o objetivo de criar uma Pokédex na web consumindo dados da [PokéAPI](https://pokeapi.co/). O sistema foi construído sem o uso de frameworks, focando na manipulação do DOM, consumo de API externa e estilização responsiva.

## 🚀 Funcionalidades

*   **Listagem Dinâmica:** Exibe uma lista inicial de Pokémon logo ao carregar a página.
*   **Navegação Paginada:** Botões de "Próxima" e "Anterior" para navegar pelo catálogo de Pokémon.
*   **Busca Integrada:** Campo de pesquisa que permite encontrar um Pokémon específico digitando o seu Nome ou o seu ID.
*   **Modal de Detalhes:**
    *   Ao clicar em qualquer card de Pokémon, um Modal sobreposto é gerado dinamicamente via manipulação do DOM.
    *   **Visual:** Exibe o GIF animado do Pokémon (extraído do diretório `showdown` da API) ou a foto estática, caso o pokemón não tenha o GIF.
    *   **Dados:** Apresenta Nome, ID e Tipagem.
    *   **Conversão de Unidades:** Os valores brutos da API (decímetros e hectogramas) são calculados matematicamente no JavaScript para exibir Altura em Metros e Peso em Quilogramas de forma amigável ao usuário.
*   **Sistema de Favoritos (LocalStorage):** O usuário pode salvar seus Pokémon favoritos clicando no botão dentro do modal. Os dados são armazenados no navegador, permanecendo salvos mesmo se a página for atualizada.
*   **Ambiente Isolado de Favoritos:**
    *   Um botão dedicado "Meus Favoritos" altera o estado da aplicação: oculta a barra de pesquisa e a paginação da API, limpando a tela para renderizar apenas os cards dos Pokémon salvos.
    *   Neste ambiente, caso o usuário remova um Pokémon dos favoritos pelo modal, o card desaparece da tela em tempo real.
    *   Um botão "Voltar para a página inicial" é revelado para garantir a navegação do usuário de volta ao fluxo normal da Pokédex.

## 🛠️ Tecnologias Utilizadas

*   **HTML5:** Estruturação semântica.
*   **CSS3:** Layout organizado utilizando Flexbox e CSS Grid, com design responsivo (adaptável para computadores e celulares).
*   **JavaScript (ES6+):** Lógica de programação, uso da função `fetch()` para requisições assíncronas (async/await) e manipulação do DOM.

## 💻 Como rodar o projeto

O projeto não exige instalação de dependências ou servidores locais complexos. Para testar:

1. Faça o download ou clone este repositório para o seu computador.
2. Abra a pasta onde os arquivos foram salvos.
3. Dê um duplo clique no arquivo `index.html`. Ele abrirá automaticamente no seu navegador de preferência.
4. **Nota:** É necessário possuir conexão com a internet para que as requisições de imagens e dados da PokéAPI funcionem corretamente.