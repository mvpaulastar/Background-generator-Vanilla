const jsonUrl = "assets/data/backgrounds.json";
let currSelection;

/*Fetch data from json file
 * Expected to be local data thus lack of handling
 **/
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

/*Fills selection based on how many entries offered by selected background*/
function populateSelect(data, selectId) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";
  for (i = 1; i < data.length + 1; i++) {
    let opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    select.append(opt);
  }
}

/*Updates background selection when user changes background selections*/
async function updateSelect() {
  const data = await fetchData(jsonUrl);
  const selection = document.getElementById("backgrounds").value;

  let background = data.backgrounds.find((el) => el.name === selection);

  populateSelect(background["traits"], "traits");
  populateSelect(background["ideals"], "ideals");
  populateSelect(background["bonds"], "bonds");
  populateSelect(background["flaws"], "flaws");

  currSelection = background;
}

/*Initial db pull to populate backgrounds selection*/
async function initData() {
  const data = await fetchData(jsonUrl);
  const backgrounds = document.getElementById("backgrounds");

  data.backgrounds.map((background) => {
    let opt = document.createElement("option");
    opt.value = background["name"];
    opt.innerHTML = background["name"];
    backgrounds.append(opt);
  });

  populateSelect(data.backgrounds[0]["traits"], "traits");
  populateSelect(data.backgrounds[0]["ideals"], "ideals");
  populateSelect(data.backgrounds[0]["bonds"], "bonds");
  populateSelect(data.backgrounds[0]["flaws"], "flaws");

  currSelection = data.backgrounds[0];
}

/*Randomly rolls up an array of background entries, No duplicates*/
function randomlyRollData(numRolls, rollingEntry) {
  let rolls = [];
  const currSelectedCopy = currSelection[rollingEntry].map((x) => x); //Clone array to prevent overwriting
  for (let i = 0; i < parseInt(numRolls); i++) {
    rolledNumber = Math.floor(Math.random() * currSelectedCopy.length);
    entry = currSelectedCopy[rolledNumber];
    rolls.push(entry);

    currSelectedCopy.splice(rolledNumber, 1);
  }
  return rolls;
}

/*Generates an HTML output of a randomly generated background entry string array*/
function generateHTMLOutput(elementId, generatedStrArr) {
  const output = document.getElementById(elementId);

  for (let i = 0; i < generatedStrArr.length; i++) {
    output.innerHTML += "<p>" + generatedStrArr[i] + "</p>";
  }
}

/*Clears previously generated entries*/
function clearAllHTMLOutputs() {
  document.getElementById("chosen-traits").innerHTML = "";
  document.getElementById("chosen-ideals").innerHTML = "";
  document.getElementById("chosen-bonds").innerHTML = "";
  document.getElementById("chosen-flaws").innerHTML = "";
}

/*Runs the entire generate background process*/
function generateBackground(form) {
  clearAllHTMLOutputs();
  const formData = new FormData(form);

  document.getElementById("chosen-background").innerHTML =
    "<p>" + formData.get("backgrounds") + "</p>";

  const generatedTraits = randomlyRollData(formData.get("traits"), "traits");
  const generatedIdeals = randomlyRollData(formData.get("ideals"), "ideals");
  const generatedBonds = randomlyRollData(formData.get("bonds"), "bonds");
  const generatedFlaws = randomlyRollData(formData.get("flaws"), "flaws");

  generateHTMLOutput("chosen-traits", generatedTraits);
  generateHTMLOutput("chosen-ideals", generatedIdeals);
  generateHTMLOutput("chosen-bonds", generatedBonds);
  generateHTMLOutput("chosen-flaws", generatedFlaws);
}

initData();
document.getElementById("backgrounds").addEventListener("change", updateSelect);
document.getElementById("generator-form").addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    generateBackground(e.target);
  },
  false
);
