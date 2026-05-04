// classe pra criar um novo nó (um proximo personagem na fila)
class No {
    constructor(valor) {
        this.valor = valor // o valor do nó vai ser o valor passado na criação do nó (objeto)
        this.proximo = null //ao criar um nó, presume-se que logo depois vai ter um proximo elemento, mesmo que ele esteja vazio por ora
    }
}

// classe para criar uma fila
class Fila {
    constructor() {
        // ao criar uma fila, ela nao tem elementos, portanto, tanto inicio qnt fim estarão vazios
        this.inicio = null
        this.fim = null
        this.tamanho = 0
    }

    //funçao pra chamar/add personagem (nó) na fila
    enfileirar(valor) {
        const no = new No(valor)

        // verificar se a fila está vazia
        if (this.inicio === null) {
            this.inicio = no
            this.fim = no
            //o personagem que for chamado primeiro, num primeiro momento sera o inicio e fim da fila
        }
        else {
            this.fim.proximo = no
            //o proximo personagem chamado depois do atual (nó) terá o valor passado na const
            this.fim = no
            //o qual sera o novo fim da fila
        }
        this.tamanho++
    }

    // funçao pra chamar o personagem e tirá-lo da fila
    desenfileirar() {
        if (this.inicio === null) {
            return alert("A fila está vazia, adicione personagens na fila para atender")
        }

        const saiu = this.inicio.valor //quem saiu da fila vai receber o valor do primeiro da fila
        this.inicio = this.inicio.proximo //o novo valor do inicio é proximo (valor) do que antes era o inicio
        this.tamanho--

        if (this.tamanho === 0) {
            this.fim = null
        }
        return saiu
    }

    //funçao para exibir o começo da fila
    comecoFila() {
        if (this.inicio) {
            return this.inicio.valor
        } else {
            return null
        }
    }

    //funçao pra verificar se a fila esta vazia ou nao
    taVazia() {
        return this.tamanho === 0 //se tiver vazia, vai aparecer "true"
    }
}


// criando a fila 
const queue = new Fila()
const apiURL = 'https://rickandmortyapi.com/api/character/'
let currentCall = null

const currentCharacter = document.getElementById('currentCharacter')
const queueList = document.getElementById('queueList')

// açoes na pagina que chama as açoes da pagina
document.getElementById('addBtn').addEventListener('click', () => addPersonagem())
document.getElementById('callBtn').addEventListener('click', () => chamarPersonagem())
document.getElementById('attendBtn').addEventListener('click', () => atenderPersonagem())

//informaçoes dos personagens na fila
const ordinal = n => `${n}º`;

const traduzir = {
    status: s => ({
        Alive: "Vivo",
        Dead: "Morto",
        unknown: "Desconhecido"
    }
    [s] || s),

    especie: e => ({
        Human: "Humano",
        Alien: "Alienígena",
        Robot: "Robô",
        "Mythological Creature": "Criatura Mítica",
        unknown: "Desconhecida"
    }[e] || e)
};


// add personagem aleatorio
async function addPersonagem() {
    const id = Math.floor(Math.random() * 826) + 1;
    try {
        const res = await fetch(apiURL + id) //a resposta vai buscar na api com o id do personagem
        const personagem = await res.json() //converte a resposta em json

        //enfileira o personagem
        queue.enfileirar(personagem)
        renderQueue();
    } catch (err) {
        console.error("Erro ao buscar personagem:", err)
    }
}

function chamarPersonagem() {
    if (queue.taVazia()) {
        return alert("A fila está vazia. Adicione personagens.")
    }

    if (currentCall !== null) {
        return alert("Já há um personagem chamado.")
    }

    //mostrando quem esta no começo da fila
    currentCall = queue.comecoFila()
    renderCurrent(currentCall)
}

function atenderPersonagem() {
    if (currentCall === null) {
        return alert("Não tem ninguém sendo atendido!")
    }

    //desenfileirando o personagem
    queue.desenfileirar()
    currentCall = null
    currentCharacter.innerHTML = `<p>Nenhum personagem em atendimento<p>`
    renderQueue()
}

//renderizaçao da fila e personagens
// Mostra personagem atual
function renderCurrent({ image, name, species, status }) {
    currentCharacter.innerHTML = `
    <div class="card">
      <img src="${image}" alt="${name}">
      <h3>${name}</h3>
      <p>Espécie: ${traduzir.especie(species)}</p>
      <p>Status: ${traduzir.status(status)}</p>
    </div>
  `;
}

// Mostra fila completa
function renderQueue() {
    let atual = queue.inicio;
    let i = 1;
    let html = "";

    while (atual !== null) {
        const c = atual.valor;

        html += `
      <div class="card">
        <p class="position">${ordinal(i)}</p>
        <img src="${c.image}" alt="${c.name}">
        <h4>${c.name}</h4>
      </div>
    `;

        atual = atual.proximo;
        i++;
    }

    queueList.innerHTML = html;
}