let map = null;
let markers = [];

let timer;
timeroutVal = 1000;

const crList = document.getElementById("cr_list").innerHTML;
const santeList = document.getElementById("sante_list").innerHTML;
const spList = document.getElementById("sp_list").innerHTML;
const mdList = document.getElementById("md_list").innerHTML;
const llsList = document.getElementById("lls_list").innerHTML;
const lvList = document.getElementById("lv_list").innerHTML;
const aidList = document.getElementById("aid_list").innerHTML;
const articlesList = document.getElementById("articles").innerHTML;

Mustache.parse(crList);
Mustache.parse(santeList);
Mustache.parse(spList);
Mustache.parse(mdList);
Mustache.parse(llsList);
Mustache.parse(lvList);
Mustache.parse(aidList);
Mustache.parse(articlesList);

let cr_index;
let sante_index;
let sp_index;
let articles;

function initAlgolia() {
  const searchClient = algoliasearch(
    "Z8UCZPROKW",
    "a6386ef5e60d8b653ab440a000fbfda8"
  );

  cr_index = instantsearch({
    indexName: "centres_ressources",
    searchClient
  });

  articles = instantsearch({
    indexName: "articles",
    searchClient,
    routing: true,
  });

  sante_index = instantsearch({
    indexName: "sante",
    searchClient,
    routing: true,
  });
  sp_index = instantsearch({
    indexName: "service_a_la_personne",
    searchClient,
    routing: true,
  });

  cr_index.addWidgets([
    
    instantsearch.widgets.configure({
      hitsPerPage: 8,
      aroundLatLng: myAddress,
      aroundRadius: myRadius,
    }),
    instantsearch.widgets.menu({
      container: "#age",
      attribute: "type.ages",
      limit: 3,
      // showMore: true,
      sortBy: ["name:desc"],
      cssClasses: {
        item: ["btn", "btn-primary"],
      },
      templates: {
        showMoreText: `
          {{#isShowingMore}}
            Voir moins
          {{/isShowingMore}}
          {{^isShowingMore}}
            Voir plus
          {{/isShowingMore}}
        `,
      },
    }),
    instantsearch.widgets.menu({
      container: "#searchFor",
      attribute: "type.demandeur",
      cssClasses: {
        item: ["btn", "btn-primary"],
      },
      sortBy: ["name:desc"],
    }),
    instantsearch.widgets.menu({
      container: "#isAutonome",
      attribute: "type.dependant",
      cssClasses: {
        item: ["btn", "btn-primary"],
      },
      sortBy: ["name:desc"],
    }),
    instantsearch.widgets.hits({
      container: "#cr_list",
      attribute: "cr_list",
      cssClasses: {
        list: ["content", "mt-2"],
      },
      templates: {
        item: (result) => {
          let render = Mustache.render(crList, result);
          return render
        },
        empty: `Aucun résultat dans le secteur demandé`,
      },
    }),
    instantsearch.widgets.pagination({
      container: "#cr_pagination",
      scrollTo: false,
    }),
    instantsearch.widgets
      .index({
        indexName: "maintien_a_dom",
      })
      .addWidgets([
        instantsearch.widgets.refinementList({
          container: "#md_filters",
          attribute: "type.filtres",
        }),
        instantsearch.widgets.pagination({
          container: "#md_pagination",
          scrollTo: false,
        }),
        instantsearch.widgets.hits({
          container: "#md_list",
          attribute: "md_list",
          cssClasses: {
            list: ["content", "mt-2"],
          },
          templates: {
            item: (result) => {
              let render = Mustache.render(mdList, result);
              return render;
            },
            empty: `Aucun résultat dans le secteur demandé`,
          },
        }),
      ]),
    instantsearch.widgets
      .index({
        indexName: "loisirs_et_liens_social",
      })
      .addWidgets([
        instantsearch.widgets.refinementList({
          container: "#lls_filters",
          attribute: "type.filtres",
        }),
        instantsearch.widgets.pagination({
          container: "#lls_pagination",
          scrollTo: false,
        }),
        instantsearch.widgets.hits({
          container: "#lls_list",
          attribute: "lls_list",
          cssClasses: {
            list: ["content", "mt-2"],
          },
          templates: {
            item: (result) => {
              let render = Mustache.render(llsList, result);
              return render;
            },
            empty: `Aucun résultat dans le secteur demandé`,
          },
        }),
      ]),
    instantsearch.widgets
      .index({
        indexName: "lieux_de_vie_et_acceuils_adaptes",
      })
      .addWidgets([
        instantsearch.widgets.refinementList({
          container: "#lv_filters",
          attribute: "type.filtres",
        }),
        instantsearch.widgets.pagination({
          container: "#lv_pagination",
          scrollTo: false,
        }),
        instantsearch.widgets.hits({
          container: "#lv_list",
          attribute: "lv_list",
          cssClasses: {
            list: ["content", "mt-2"],
          },
          templates: {
            item: (result) => {
              let render = Mustache.render(lvList, result);
              return render;
            },
            empty: `Aucun résultat dans le secteur demandé`,
          },
        }),
      ]),
    instantsearch.widgets
      .index({
        indexName: "aidant",
        
      })
      .addWidgets([
        instantsearch.widgets.hits({
          container: "#aid_list",
          attribute: "aid_list",
          cssClasses: {
            list: ["content", "mt-2"],
          },
          templates: {
            item: (result) => {
              let render = Mustache.render(lvList, result);
              return render;
            },
            empty: `Aucun résultat dans le secteur demandé`,
          },
        }),
        instantsearch.widgets.pagination({
          container: "#aid_pagination",
          scrollTo: false,
        }),
      ]),
  ]);

  sante_index.addWidgets([
    instantsearch.widgets.configure({
      hitsPerPage: 8,
      aroundLatLng: myAddress,
      aroundRadius: myRadius,
    }),
    instantsearch.widgets.refinementList({
      container: "#sante_filters",
      attribute: "type.filtres",
    }),
    instantsearch.widgets.pagination({
      container: "#sante_pagination",
    }),
    instantsearch.widgets.hits({
      container: "#sante_list",
      attribute: "sante_list",
      cssClasses: {
        list: ["content", "mt-2"],
      },
      templates: {
        item: (result) => {
          let render = Mustache.render(santeList, result);
          return render;
        },
        empty: "Aucun résultat dans le secteur demandé",
      },
    }),
  ]);

  sp_index.addWidgets([
    instantsearch.widgets.configure({
      hitsPerPage: 8,
      aroundLatLng: myAddress,
      aroundRadius: myRadius,
    }),
    instantsearch.widgets.refinementList({
      container: "#sp_filters",
      attribute: "type.filtres",
    }),
    instantsearch.widgets.pagination({
      container: "#sp_pagination",
    }),
    instantsearch.widgets.hits({
      container: "#sp_list",
      attribute: "sp_list",
      cssClasses: {
        list: ["content", "mt-2"],
      },
      templates: {
        item: (result) => {
          let render = Mustache.render(spList, result);
          return render;
        },
        empty: "Aucun résultat dans le secteur demandé",
      },
    }),
  ]);

  articles.addWidgets([
    instantsearch.widgets.configure({
      hitsPerPage: 5,
    }),
    instantsearch.widgets.hits({
      container: "#articles",
      attribute: "articles",
      templates: {
        item: (result) => {
          let render = Mustache.render(articlesList, result);
          return render;
        },
        empty: "Aucun résultat dans le secteur demandé",
      },
    }),
    instantsearch.widgets.pagination({
      container: "#articles_pagination",
    }),
  ]);

  cr_index.start();
  sante_index.start();
  sp_index.start();
  articles.start();
}
