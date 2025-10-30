function localTime() {
  const now = new Date().toLocaleTimeString();
  document.getElementById("current-time").textContent = now;
}

async function getRecommendations() {
  try {
    const recs = await fetch("travel_recommendation_api.json");
    const res = await recs.json();
    return transformData(res);
  } catch (error) {
    console.error(error);
  }
}

function transformData(data) {
  const result = [];

  // Extract cities from countries
  if (data.countries) {
    data.countries.forEach((country) => {
      country.cities.forEach((city) => {
        result.push({
          title: city.name,
          imageUrl: city.imageUrl,
          desc: city.description,
        });
      });
    });
  }

  // Extract temples
  if (data.temples) {
    data.temples.forEach((temple) => {
      result.push({
        title: temple.name,
        imageUrl: temple.imageUrl,
        desc: temple.description,
      });
    });
  }

  // Extract beaches
  if (data.beaches) {
    data.beaches.forEach((beach) => {
      result.push({
        title: beach.name,
        imageUrl: beach.imageUrl,
        desc: beach.description,
      });
    });
  }

  return result;
}

function createRecCard(title, desc, imageUrl) {
  // Create main container
  const recCard = document.createElement("div");
  recCard.classList.add("rec-card");

  // Create image element
  const img = document.createElement("img");
  img.classList.add("rec-img");
  img.src = imageUrl;

  // Create content container
  const recContent = document.createElement("div");
  recContent.classList.add("rec-content");

  // Create title
  const titleEl = document.createElement("h6");
  titleEl.classList.add("rec-title");
  titleEl.textContent = title;

  // Create description
  const descEl = document.createElement("p");
  descEl.classList.add("rec-desc");
  descEl.textContent = desc;
  // Create button
  const button = document.createElement("button");
  button.classList.add("rect-more");
  button.textContent = "Visit";

  // Build the structure
  recContent.appendChild(titleEl);
  recContent.appendChild(descEl);
  recContent.appendChild(button);

  recCard.appendChild(img);
  recCard.appendChild(recContent);

  // Return the completed card
  return recCard;
}

function addRecs(recs) {
  const recsEl = document.getElementById("recommendations");

  recs.forEach((rec) => {
    const { title, desc, imageUrl } = rec;
    const recEl = createRecCard(title, desc, imageUrl);
    recsEl.appendChild(recEl);
  });
}

async function search(keyword) {
  clear();
  try {
    const recs = await fetch("travel_recommendation_api.json");
    const db = await recs.json();

    const result = [];

    switch (keyword) {
      case "country":
      case "countries":
        db.countries.forEach((country) => {
          country.cities.forEach((city) => {
            result.push({
              title: city.name,
              imageUrl: city.imageUrl,
              desc: city.description,
            });
          });
        });
        break;
      case "temple":
      case "temples":
        db.temples.forEach((temple) => {
          result.push({
            title: temple.name,
            imageUrl: temple.imageUrl,
            desc: temple.description,
          });
        });
        break;
      case "beaches":
      case "beach":
        db.beaches.forEach((beach) => {
          result.push({
            title: beach.name,
            imageUrl: beach.imageUrl,
            desc: beach.description,
          });
        });
        break;
    }

    addRecs(result);
  } catch (error) {
    console.error(error);
  }
}

function clear() {
  const recsEl = document.getElementById("recommendations");
  recsEl.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", async () => {
  // Set up local time
  localTime();
  setInterval(localTime, 1000);

  // Get recommendations
  const recs = await getRecommendations();
  addRecs(recs);

  // Search
  const searchBtn = document.getElementById("btnSearch");
  searchBtn.addEventListener("click", () => {
    const keyword = document.getElementById("search").value.trim();
    if (keyword) {
      search(keyword);
    }
  });

  // Clear Search
  const clearBtn = document.getElementById("btnReset");
  clearBtn.addEventListener("click", () => {
    clear();
    document.getElementById("search").value = "";
    addRecs(recs);
  });
});
