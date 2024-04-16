const containerCards = document.getElementById("card-container");
const informacoesFooter = document.getElementById("info-footer");

let acc = 1;

const infos = async () => {
  try {
    const personagens = await api.get("/character");
    const nPersona = personagens.data.info.count;

    const localizacao = await api.get("/location");
    const nLocalizacao = localizacao.data.info.count;

    const episodeos = await api.get("/episode");
    const nEpisodeos = episodeos.data.info.count;

    informacoesFooter.innerHTML = `<p class="fw-bold infos me-5">PERSONAGENS: <span class="fw-bold text-light">${nPersona}</span></p> <p  class="fw-bold mx-5 infos">LOCALIZAÇÕES:<span class="fw-bold text-light">${nLocalizacao}</span></p><p class="fw-bold ms-5 infos"> EPISÓDIOS: <span class="fw-bold text-light">${nEpisodeos}</span></p>`;
  } catch (error) {
    console.log(error);
  }
};

infos();

const pegarPersonagens = () => {
  api
    .get(`/character/[${acc++},${acc++},${acc++},${acc++},${acc++},${acc++}]`)
    .then(async function (response) {
      const personagens = response.data;

      await personagens.map(function (character, index) {
        const ultimoEpisodeo = character.episode.at(-1);

        let cardHtml = ` 
            <div class="col-6">
            <div class="card mb-3">
              <div class="row g-0" id="row-cards">
                <div class="col-md-5">
                  <img src="${character.image}" class="img-fluid rounded-start" alt="..." />
                </div>
                <div class="col-md-7">
                  <div class="card-body">
                  <a href='' data-bs-toggle="modal" data-bs-target="#exampleModal${character.id}"class="card-title text-light fw-bold ancora-modal fs-4">
                    ${character.name}
                    </a>
                    <p class="card-text text-light fw-bold">
                    <span class="${character.status}"></span>
                    ${character.status} - ${character.species}
                    </p>
                    <p class="card-text  text-subtitle fw-bold">
                      Última localização conhecida </br>
                      <span class="text-light fw-bold">${character.location.name}</span>
                    </p>
                    <p class="card-text ">
                    </p>
                    <p class="card-text text-subtitle fw-bold">
                      Último episódio visto: </br>
                      <span class="text-light fw-bold" id="episodeo-${character.id}">--------</span>
                    </p>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div class="modal fade" id="exampleModal${character.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 fw-bold" id="exampleModalLabel">${character.name}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body d-flex flex-column">
                <img src="${character.image}" alt="" />
                <div class="mt-3">
                <p class="card-text text-white status-text">
                Status:   
                ${character.status}
                <span class="${character.status} mx-2"></span>
                </p>
                  <p>Especie: ${character.species}</p>
                  <p>Gênero: ${character.gender}</p>
                  <p>Origem: ${character.origin.name}</p>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Fechar</button>
              </div>
            </div>
          </div>
        </div>
        `;
        if (index > 4) {
          cardHtml =
            '<div class="col-6 d-flex justify-content-end"></div>' + cardHtml;
        }
        containerCards.innerHTML += cardHtml;

        api
          .get(ultimoEpisodeo)
          .then(function (episode) {
            const episodeNome = episode.data.name;
            const episeoID = document.getElementById(
              `episodeo-${character.id}`
            );

            episeoID.innerHTML = episodeNome;
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

pegarPersonagens();

const paginaAnterior = () => {
  if (acc > 7) {
    acc -= 12;
    containerCards.innerHTML = ``;
    pegarPersonagens();
  }
};

const proximaPagina = () => {
  containerCards.innerHTML = ``;
  pegarPersonagens();
};

const btnProcurar = async () => {
  try {
    const btnProcurar = document
      .getElementById("btnProcurar")
      .value.toLowerCase();

    const response = await api.get(`/character/?name=${btnProcurar}`);
    const personagens = response.data.results;

    containerCards.innerHTML = ``;

    personagens.map(async function (character, index) {
      const ultimoEpisodeo = character.episode.at(-1);

      const episodeo = await api.get(ultimoEpisodeo);

      const nomeEpisodeo = episodeo.data.name;
      if (index < 6) {
        let cardHtml = `
        <div class="col-6">
          <div class="card mb-3">
            <div class="row g-0" id="row-cards">
              <div class="col-md-5">
                <img src="${character.image}" class="img-fluid rounded-start" alt="..." />
              </div>
              <div class="col-md-7">
                <div class="card-body">
                <a href='' data-bs-toggle="modal" data-bs-target="#exampleModal${character.id}"class="card-title text-white">
                  ${character.name}
                </a>
                  <p class="card-text text-white status-text">
                  <span class="${character.status}"></span>
                  ${character.status} - ${character.species}
                  </p>
                  <p class="card-text my-text-body">
                    Última localização conhecida </br>
                    <span class="text-white">${character.location.name}</span>
                  </p>
                  <p class="card-text ">
                  </p>
                  <p class="card-text my-text-body">
                    Último episódio visto: </br>
                    <span class="text-white">${nomeEpisodeo}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal fade" id="exampleModal${character.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5 fw-bold" id="exampleModalLabel">${character.name}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body d-flex flex-column">
                <img src="${character.image}" alt="" />
                <div class="mt-3">
                <p class="card-text text-white status-text">
                Status:   
                ${character.status}
                <span class="${character.status} mx-2"></span>
                </p>
                  <p>Especie: ${character.species}</p>
                  <p>Gênero: ${character.gender}</p>
                  <p>Origem: ${character.origin.name}</p>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Fechar</button>
              </div>
            </div>
          </div>
        </div>
    `;
        if (index > 4) {
          cardHtml = '<div class="col-6"></div>' + cardHtml;
        }
        containerCards.innerHTML += cardHtml;
      }
    });
  } catch (error) {
    console.log(error);
  }
};
