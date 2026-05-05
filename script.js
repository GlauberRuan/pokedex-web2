// elementos principais
const pokedexContainer = document.getElementById('pokedex-container');
const loadingMensagem = document.getElementById('loading');
const btnAnterior = document.getElementById('btn-anterior');
const btnProxima = document.getElementById('btn-proxima');
const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');
const btnLimpar = document.getElementById('btn-limpar');
const btnVerFavoritos = document.getElementById('btn-favoritos');
const divNavegacao = document.querySelector('.navegacao');

// áreas novas de busca e o botão de voltar
const containerBusca = document.getElementById('container-busca');
const containerVoltar = document.getElementById('container-voltar');
const btnVoltarInicio = document.getElementById('btn-voltar-inicio');

// elementos do Modal
const modal = document.getElementById('modal-detalhes');
const fecharModal = document.getElementById('fechar-modal');
const infoPokemon = document.getElementById('info-pokemon');

// Variáveis de navegação e Favoritos (localStorage)
const urlInicial = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
let urlAnterior = null;
let urlProxima = null;
let listaFavoritos = JSON.parse(localStorage.getItem('favoritosPokedex')) || []; 

// CARREGAR E RENDERIZAR A LISTA
async function carregarPokemons(url) {
    try {
        loadingMensagem.style.display = 'block';
        loadingMensagem.textContent = 'Carregando os Pokémon... aguenta aí, boy!';
        pokedexContainer.innerHTML = '';
        
        // Garante que a barra de busca tá na tela, e o botão de voltar escondido
        containerBusca.style.display = 'flex';
        containerVoltar.style.display = 'none';
        divNavegacao.style.display = 'flex'; 

        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        urlAnterior = dados.previous;
        urlProxima = dados.next;
        btnAnterior.disabled = !urlAnterior;
        btnProxima.disabled = !urlProxima;

        loadingMensagem.style.display = 'none';
        renderizarLista(dados.results);
    } catch (erro) {
        loadingMensagem.textContent = 'Vixe! Deu erro ao carregar os Pokémon.';
        console.error('Erro:', erro);
    }
}

function renderizarLista(listaPokemons) {
    listaPokemons.forEach(pokemon => {
        let id;
        if (pokemon.id) {
            id = pokemon.id;
        } else {
            const partesUrl = pokemon.url.split('/');
            id = partesUrl[partesUrl.length - 2];
        }
        
        const imagemUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.innerHTML = `
            <img src="${imagemUrl}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p>#${id}</p>
        `;
        card.addEventListener('click', () => mostrarDetalhes(pokemon.name));
        pokedexContainer.appendChild(card);
    });
}

// BUSCA DE POKÉMON
async function buscarPokemon() {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    if (!termoBusca) return;

    try {
        loadingMensagem.style.display = 'block';
        loadingMensagem.textContent = 'Procurando o Pokémon...';
        pokedexContainer.innerHTML = '';
        divNavegacao.style.display = 'none'; 

        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${termoBusca}`);
        if (!resposta.ok) throw new Error('Pokémon não encontrado');

        const pokemon = await resposta.json();
        loadingMensagem.style.display = 'none';
        
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p>#${pokemon.id}</p>
        `;
        card.addEventListener('click', () => mostrarDetalhes(pokemon.name));
        pokedexContainer.appendChild(card);
    } catch (erro) {
        loadingMensagem.textContent = 'Vixe! Nenhum resultado pra esse nome ou ID, boy!';
        loadingMensagem.style.display = 'block';
    }
}

// MOSTRAR DETALHES NO MODAL E PODER FAVORITAR
async function mostrarDetalhes(nomePokemon) {
    try {
        modal.style.display = 'block';
        infoPokemon.innerHTML = '<p>Carregando detalhes...</p>';

        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);
        const pokemon = await resposta.json();

        const alturaMetros = pokemon.height / 10;
        const pesoKg = pokemon.weight / 10;
        const tiposHtml = pokemon.types.map(tipo => `<span class="tipo">${tipo.type.name}</span>`).join('');

        const jaEhFavorito = listaFavoritos.some(fav => fav.name === pokemon.name);
        const textoBotao = jaEhFavorito ? 'Remover dos Favoritos 💔' : 'Adicionar aos Favoritos ❤️';
        const classeBotao = jaEhFavorito ? 'favoritado' : '';

        // GIF PARA O MODAL
        // pegar o gif no 'showdown'. Se não achar (||), pega a imagem normal.
        const imagemModal = pokemon.sprites.other.showdown.front_default || pokemon.sprites.front_default;

        infoPokemon.innerHTML = `
            <img src="${imagemModal}" alt="${pokemon.name}" style="width: 100px; margin-bottom: 15px;">
            <h2>${pokemon.name} (#${pokemon.id})</h2>
            <div>${tiposHtml}</div>
            <p><strong>Altura:</strong> ${alturaMetros} m</p>
            <p><strong>Peso:</strong> ${pesoKg} kg</p>
            <button id="btn-favoritar-modal" class="${classeBotao}">${textoBotao}</button>
        `;

        document.getElementById('btn-favoritar-modal').addEventListener('click', () => {
            if (jaEhFavorito) {
                listaFavoritos = listaFavoritos.filter(fav => fav.name !== pokemon.name);
            } else {
                listaFavoritos.push({ name: pokemon.name, id: pokemon.id });
            }
            localStorage.setItem('favoritosPokedex', JSON.stringify(listaFavoritos));
            
            if (containerBusca.style.display === 'none') {
                pokedexContainer.innerHTML = '';
                renderizarLista(listaFavoritos);
                if (listaFavoritos.length === 0) {
                    loadingMensagem.style.display = 'block';
                    loadingMensagem.textContent = 'Vixe! Tu não tem nenhum Pokémon favoritado ainda!';
                }
            }
            
            mostrarDetalhes(pokemon.name); 
        });

    } catch (erro) {
        infoPokemon.innerHTML = '<p>Vixe! Deu erro ao carregar os detalhes.</p>';
        console.error('Erro:', erro);
    }
}

// FUNÇÃO PARA MOSTRAR APENAS FAVORITOS
btnVerFavoritos.addEventListener('click', () => {
    pokedexContainer.innerHTML = '';
    
    // Esconde a busca e a navegação da API, e mostra só o botão de voltar
    containerBusca.style.display = 'none';
    divNavegacao.style.display = 'none';
    containerVoltar.style.display = 'block';

    if (listaFavoritos.length === 0) {
        loadingMensagem.style.display = 'block';
        loadingMensagem.textContent = 'Vixe! Tu não tem nenhum Pokémon favoritado ainda!';
        return;
    }

    loadingMensagem.style.display = 'none';
    renderizarLista(listaFavoritos);
});

// BOTÃO QUE APARECE QUANDO ABRO OS FAVORTISO  "VOLTAR AO INICIO"
btnVoltarInicio.addEventListener('click', () => {
    inputBusca.value = '';
    carregarPokemons(urlInicial);
});

// EVENTOS DE CLIQUE E TECLADO
btnAnterior.addEventListener('click', () => urlAnterior && carregarPokemons(urlAnterior));
btnProxima.addEventListener('click', () => urlProxima && carregarPokemons(urlProxima));
btnBuscar.addEventListener('click', buscarPokemon);
inputBusca.addEventListener('keypress', (e) => e.key === 'Enter' && buscarPokemon());
btnLimpar.addEventListener('click', () => {
    inputBusca.value = '';
    carregarPokemons(urlInicial);
});

fecharModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (evento) => {
    if (evento.target === modal) modal.style.display = 'none';
});

// --- INICIAR A POKÉDEX ---
carregarPokemons(urlInicial);