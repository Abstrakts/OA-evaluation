
let myAddress;
let myRadius;

let setAddressButton = document.getElementById("locateButton");
let addressInput = document.getElementById("address");
let radiusInput = document.getElementById("km_radius");

let OA_logo = document.querySelector(".OA-logo");
let choiceButton = document.querySelectorAll(".choice");
let testmd = document.getElementById('md_national').innerHTML

window.onresize = updateLogo;
window.onload = updateLogo;

function updateLogo() {
  if (window.innerWidth >= 960) {
    OA_logo.src = "../assets/images/OA-logo.svg";
  } else {
    OA_logo.src = "../assets/images/OA-logo-light.svg";
  }
}

const dataHandler = {
  toggleMap: document.getElementById("flexSwitchCheckChecked"),
  startButton: document.getElementById("startButton"),
  map: false,
  started: false,
  addressSet: false,
  user: [],
  national_md: [],
  aidant: true,

  init() {
    fetch(
      "https://alexandrie.av42.com/items/solutions/?fields=nom,url&filter[type][_in]=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,61"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.data.length; i++) {
          this.national_md.push({
            name: data.data[i].nom,
            url: data.data[i].url,
          });
          //console.log(this.national_md[i].name)
          //Mustache.render(testmd, this.national_md[i])
        }
      });

    
    setAddressButton.addEventListener("click", () => {
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${addressInput.value}`)
        .then((response) => response.json())
        .then((data) => {
          myAddress = data.features[0].geometry.coordinates.reverse().join(",");
          myRadius = Number(radiusInput.value) * 1000;
          initAlgolia();
          this.addressSet = true;
        });

        
    });
    // toggle and set map
    this.toggleMap.addEventListener("input", () => {
      if (this.toggleMap.checked) {
        this.map = true;
      } else {
        this.map = false;
      }
    });

    this.startButton.addEventListener("click", () => {
      this.started = true;
      window.scrollTo(0, 0);
    });

    /* for (let i = 0; i < choiceButton.length; i++) {
      // add event to all choices button
      choiceButton[i].setAttribute("x-on:click", "registerResponse()");
      if (choiceButton[i].innerHTML.length <= 15) {
        // set value of button with html content
        choiceButton[i].setAttribute("value", choiceButton[i].innerHTML);
      } else {
        // set value of button with image name
        let noPath = choiceButton[i].children[0]
          .getAttribute("src")
          .replace(/[a-z]*[\/][a-z]*[\/]/, ""); */
    //let formatSrc = noPath.replace(/[.][a-z]*/, "");
    // choiceButton[i].setAttribute("value", formatSrc);
    //}
    //}
  },
  registerResponse(e) {
    e = e || window.event;
    let target = e.target || e.srcElement;

    console.log(target);
    target.classList.toggle("active");
  },
  removeAlgolia() {
    this.started = !this.started;
    this.addressSet = false;
    cr_index.dispose();
    sante_index.dispose();
    sp_index.dispose();
  },
};
