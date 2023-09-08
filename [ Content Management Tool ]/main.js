document.addEventListener("DOMContentLoaded", function () {
  // Get references to HTML elements
  const addForm = document.querySelector("#addForm form");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const articleTable = document.querySelector("#articleTable table");
  const articleContent = document.getElementById("articleContent");

  // Load existing articles from localStorage
  const storedArticles = JSON.parse(localStorage.getItem("articles")) || [];

  // Update the article table in the HTML
  function updateArticleTable() {
    articleTable.innerHTML = `
            <tr>
                <th>Title</th>
                <th>Actions</th>
            </tr>
        `;

    for (const [index, article] of storedArticles.entries()) {
      // Create new rows for title and actions
      const newRow = articleTable.insertRow();
      const titleCell = newRow.insertCell();
      const actionsCell = newRow.insertCell();

      // Set title and actions content
      titleCell.textContent = article.title;
      titleCell.classList.add("article-title");

      actionsCell.innerHTML = `
                <div class="btn-container">
                    <button class="btn-edit" data-index="${index}">Edit</button>
                    <button class="btn-delete" data-index="${index}">Delete</button>
                </div>
            `;

      // Create a row for content
      const contentRow = articleTable.insertRow();
      const contentCell = contentRow.insertCell();
      contentCell.classList.add("article-content");
      contentCell.colSpan = 2;
      contentCell.textContent = article.content;
      contentCell.style.display = "none";
    }
  }

  // Load articles from localStorage when the page loads
  window.addEventListener("load", function () {
    updateArticleTable();
  });

  // Handle form submission for adding new articles
  addForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    const title = titleInput.value;
    const content = contentInput.value;

    // Add new article to storedArticles array and update localStorage
    storedArticles.push({ title, content });
    localStorage.setItem("articles", JSON.stringify(storedArticles));

    // Update the article table in the HTML and reset input values
    updateArticleTable();
    titleInput.value = "";
    contentInput.value = "";
  });

  // Handle clicks on the article table
  articleTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("article-title")) {
      // Toggle display of article content
      const contentCell =
        event.target.parentElement.nextElementSibling.querySelector(
          ".article-content"
        );
      contentCell.style.display =
        contentCell.style.display === "none" ? "table-cell" : "none";
    } else if (event.target.classList.contains("btn-edit")) {
      // Handle edit button click
      const index = event.target.getAttribute("data-index");
      const article = storedArticles[index];

      // Populate form fields with article data
      titleInput.value = article.title;
      contentInput.value = article.content;

      // Remove the edited article and update localStorage
      storedArticles.splice(index, 1);
      localStorage.setItem("articles", JSON.stringify(storedArticles));

      // Update the article table in the HTML
      updateArticleTable();
    } else if (event.target.classList.contains("btn-delete")) {
      // Handle delete button click
      const index = event.target.getAttribute("data-index");

      // Remove the article and update localStorage
      storedArticles.splice(index, 1);
      localStorage.setItem("articles", JSON.stringify(storedArticles));

      // Update the article table in the HTML
      updateArticleTable();
    }
  });

  // Function to add an element to the article's content
  function addToArticle(content) {
    const element = document.createElement("div");
    element.innerHTML = content;
    articleContent.appendChild(element);
  }

  // Handle click events for adding images
  document.getElementById("addImage").addEventListener("click", (event) => {
    event.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", (event) => {
      // Handle image file selection and display
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          addToArticle(`<img src="${e.target.result}" alt="Image">`);
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
  });

  // Handle click events for adding videos
  document.getElementById("addVideo").addEventListener("click", (event) => {
    event.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.addEventListener("change", (event) => {
      // Handle video file selection and display
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          addToArticle(
            `<video controls><source src="${e.target.result}" type="video/mp4">Your browser does not support the video tag.</video>`
          );
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
  });

  // Handle click events for adding images via URL
  document.getElementById("addImageUrl").addEventListener("click", (event) => {
    event.preventDefault();
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      addToArticle(`<img src="${imageUrl}" alt="Image">`);
    }
  });

  // Handle click events for adding videos via URL
  document.getElementById("addVideoUrl").addEventListener("click", (event) => {
    event.preventDefault();
    const videoUrl = prompt("Enter video URL:");
    if (videoUrl) {
      addToArticle(
        `<video controls><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`
      );
    }
  });

  // Save content to local storage before leaving the page
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("articles", JSON.stringify(storedArticles));
  });
});
