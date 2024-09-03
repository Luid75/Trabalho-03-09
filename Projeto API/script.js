// Função para Cadastrar os produtos;

function cadastrar() {
  const nome = document.getElementById("nome").value;
  const desc = document.getElementById("descricao").value;
  const preco = document.getElementById("preco").value;
  const qtd = document.getElementById("qtd").value;

  if (nome == "" || desc == "" || preco == "" || qtd == "" ) {
    alert("Preencha todos os campos");
  } else {
    fetch("https://diniz.dev.br/produtos/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nome,
        descricao: desc,
        preco: preco,
        quantidade: qtd
      }),
    }).then(response => response.json())
      .then(data => {
        alert(data.message);
        carregarProdutos();
        limparFormulario();
      })
      .catch(err => console.log(err));
  }
}

// Função para limpar o formulário ao adicionar os produtos;

function limparFormulario() {
  document.getElementById("nome").value = '';
  document.getElementById("descricao").value = '';
  document.getElementById("preco").value = '';
  document.getElementById("qtd").value = '';
}

// Função para carregar os produtos na tabela;

function carregarProdutos() {
  fetch("https://diniz.dev.br/produtos/").then(response => response.json())
  .then(data => {
    let conteudo = '';
    data.forEach(produto => {
      conteudo += ` 
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.descricao}</td>
        <td>${produto.preco}</td>
        <td>${produto.quantidade}</td>
        <td>
          <button class="edit" onclick="editar(${produto.id})">Editar</button>
          <button class="excluir" onclick="remover(${produto.id})">Excluir</button>
        </td>
      </tr>`;
    });
    document.getElementById('lista').innerHTML = conteudo;
  })
  .catch(err => console.log(err))
}

//Função para editar os produtos adicionados;

let produtoAtual = null;

function editar(id) {
  produtoAtual = id;

  fetch(`https://diniz.dev.br/produtos/?id=${id}`)
    .then(response => response.json())
    .then(produto => {
      document.getElementById("modalNome").value = produto.nome;
      document.getElementById("modalDescricao").value = produto.descricao;
      document.getElementById("modalPreco").value = produto.preco;
      document.getElementById("modalQtd").value = produto.quantidade;

      $('#editModal').modal('show');
    })
    .catch(err => console.log('Erro ao carregar o produto:', err));
}

// Função para Salvar as Alterações feitas; (utilizado através do modal copiado de um bootstrap)

function salvarAlteracoes() {
  const nome = document.getElementById("modalNome").value;
  const descricao = document.getElementById("modalDescricao").value;
  const preco = document.getElementById("modalPreco").value;
  const quantidade = document.getElementById("modalQtd").value;

  if (nome === "" || descricao === "" || preco === "" || quantidade === "") {
    alert("Todos os campos devem ser preenchidos.");
    return;
  }

  fetch(`https://diniz.dev.br/produtos/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: produtoAtual,
      nome: nome,
      descricao: descricao,
      preco: preco,
      quantidade: quantidade
    })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    $('#editModal').modal('hide');
    carregarProdutos();
  })
  .catch(err => console.log('Erro ao atualizar o produto:', err));
}

// Função para remover os produtos;

function remover(id) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    fetch(`https://diniz.dev.br/produtos/?id=${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      carregarProdutos();
    })
    .catch(err => console.log('Erro ao excluir o produto:', err));
  }
}