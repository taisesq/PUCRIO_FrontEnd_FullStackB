//função que busca os tipos de produtos do banco
async function getProductTypeData() {
  document.getElementById("lblMessage").innerHTML =
    "Carregando dados ...."; // Clear previous results

  const requestOptions = {
    method: "GET", // Specify the HTTP method
    headers: {
      "Content-Type": "application/json", // Set the content type of the request body
    },
  };

  const apiUrl = "http://127.0.0.1:15264/get_all";


  const response = await fetch(apiUrl, requestOptions);

  if (!response.ok) {
    document.getElementById(
      "lblMessage"
    ).innerHTML = `${response.status} ${response.statusText}`; // Clear previous results
    document.getElementsByClassName("divMessage")[0].display = "block";
    return false;
  }

  const data = await response.json();
  return data.product_types;
}

//função que busca os tipos de produtos do banco
async function deleteProductTypeData(id) {
  document.getElementById("lblMessage").innerHTML =
    "Atualizando dados ...."; // Clear previous results

  const requestOptions = {
    method: "DELETE", // Specify the HTTP method
    headers: {
      "Content-Type": "application/json", // Set the content type of the request body
    },
  };

  const apiUrl = "http://127.0.0.1:15264/product_types/" + id; //API endpoint 


  const response = await fetch(apiUrl, requestOptions);

  if (!response.ok) {
    document.getElementById(
      "lblMessage"
    ).innerHTML = `${response.status} ${response.statusText}`; // Clear previous results
    document.getElementsByClassName("divMessage")[0].display = "block";
    return false;
  }

  const data = await response.json();
  return data.product_types;
}

//função que salva os valores no banco de dados através da api
async function saveProductTypeData(product_type_name, id) {
  document.getElementById("lblMessage").innerHTML = "Criando dados ....";

  //url da api - padrão para insert
  let apiUrl = "http://127.0.0.1:15264/product_types";
  

  //body padrão para insert
  let requestOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: product_type_name }),
  };	

  //se o id maior que 0 ele editará
  if(id>0)
  {
      requestOptions = {
          method: "PUT", // então mudo o verbo para PUT
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: product_type_name }),
      };

      apiUrl = "http://127.0.0.1:15264/product_types/"+id; //muda a url de acordo com o que api pede
      
  }                

  //manda a requisiçao e aguarda a resposta
  const response = await fetch(apiUrl, requestOptions);

  //se a resposta não for ok
  if (!response.ok) {
    document.getElementById(
      "lblMessage"
    ).innerHTML = `${response.status} ${response.statusText}`; // Clear previous results
    document.getElementsByClassName("divMessage")[0].display = "block";
    return false;
  }

  //retorna a resposta
  return response;
}

//função que popula tabela de tipos de produtos
async function populateTable() {
  const tbody = document.querySelector("#tblProductTypes tbody");
  tbody.innerHTML = "";

  const dataSource = await getProductTypeData();

  if (!dataSource || dataSource.length == 0) {
    const row = `<tr>
                  <td class="text-center text-danger" colspan="4">Sem dados cadastrados</td>
                  </tr>`;
    tbody.innerHTML += row;
    document.getElementsByClassName("divMessage")[0].style.display =
      "none";
    return false;
  }

  for (const data of dataSource) {
    const row = `<tr>
                  <td>${data[0]}</td>
                  <td>${data[1]}</td>
                  <td><button type="button" class="btn btn-primary btn-sm" onclick="editProductType(${data[0]},'${data[1]}')">Editar</button></td>
                  <td><button type="button" class="btn btn-danger btn-sm" onclick="deleteProductType(${data[0]})">Apagar</button></td>
                  </tr>`;
    tbody.innerHTML += row;
  }

  document.getElementsByClassName("divMessage")[0].style.display = "none";
}

//encapsulamento de funções
async function saveProductType() {
  //pega os valores serem inseridos ou editados
  var inputData = document.getElementById("dataInput").value;
  var inputDataId = document.getElementById("dataInputId").value;
  document.getElementById("dataInput").focus();     

  //envia para função que persiste os dados através da api
  const productTypeCreated = await saveProductTypeData(inputData,inputDataId);

  //se a resposta da api for não ok // mostro erro
  if (!productTypeCreated.ok) {
    document.getElementById(
      "lblMessage"
    ).innerHTML = `${productTypeCreated.status} ${productTypeCreated.statusText}`; // Clear previous results
    document.getElementsByClassName("divMessage")[0].display = "block";
    return false;
  }

  //busco os dados na api de novo e remonto a tabela
  populateTable();

  //limpo os dados dos campos para uma nova edição ou inserção
  document.getElementById("dataInputId").value = "";
  document.getElementById("dataInput").value = "";

}

//função que chama modal para edição
function editProductType(id,text) {
  document.getElementById("dataInputId").value = id;
  document.getElementById("dataInput").value = text;  

}

//função que chama modal para edição
function deleteProductType(id) {
  var ok = confirm("tem certeza");
  if (ok) {
    deleteProductTypeData(id);
    populateTable();
  }
}

// Call the function to populate the table when the page loads
document.addEventListener("DOMContentLoaded", function () {
  //para simular 500ms de delay para buscar os dados
  setTimeout(function () {
    populateTable();
  }, 500);
});
