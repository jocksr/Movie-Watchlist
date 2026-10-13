// Setup
let d = document;
const titleInput = d.getElementById("movie-title");
const genreSelect = d.getElementById("movie-genre");
const message = d.getElementById("form-message");
const movieList = d.getElementById("movie-list");
const emptyMessage = d.getElementById("empty-message");
const noData = d.getElementById("no-data");
const form = d.getElementById("movie-form");
const submitButton = d.getElementById("submit-button");

const watchList = {
    movies: [],

    toggleWatched(index) {
        // Research showed this will toggle this function the same as the following: this.movies[index].watched = !this.movies[index].watched;
        if (this.movies[index].watched == true) { this.movies[index].watched = false; }
        else { this.movies[index].watched = true; }
    },

    removeMovie(index) {
        
        this.movies.splice(index, 1);
    }
};

function saveMovies() {
    localStorage.setItem("movies", JSON.stringify(watchList.movies));
    noData.hidden = true;
}

function loadMovies() {
    const savedData = localStorage.getItem("movies");

    if (savedData !== null) {
        watchList.movies = JSON.parse(savedData);
        noData.hidden = true;
    } else {
        watchList.movies = [];
        noData.hidden = false;
    }
}

function checkForm() {
    const cTitle = titleInput.value.trim();
    const cGenre = genreSelect.value;

    if (cTitle !== "" && cGenre !== "") {
        submitButton.disabled = false;
    }
    else { submitButton.disabled = true; }
}
titleInput.addEventListener("input", checkForm);
genreSelect.addEventListener("change", checkForm);

function renderMovies() {
    movieList.replaceChildren();
    emptyMessage.hidden = watchList.movies.length > 0;

    watchList.movies.forEach((movie, index) => {
        const row = d.createElement("tr");

        // Column 1: Title
        const titleCell = d.createElement("td");
        titleCell.textContent = movie.title;

        // Column 2: Genre
        const genreCell = d.createElement("td");
        genreCell.textContent = movie.genre;

        // Column 3: Watched (Yes or No)
        const watchedCell = d.createElement("td");
        // Some research showed I can do the follow this way too: watchedCell.textContent = movie.watched ? "Yes" : "No";
        if (movie.watched == true) {
            watchedCell.textContent = "Yes";
        }
        else { watchedCell.textContent = "No"; }

        // Column 4: Toggle Watched button
        const toggleCell = d.createElement("td");
        const toggleButton = d.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "btn btn-primary btn-sm";
        // Could do similar here too
        if (movie.watched == true) { toggleButton.textContent = "Mark Unwatched"; }
        else if (movie.watched == false) { toggleButton.textContent = "Mark Watched"; }

        toggleButton.addEventListener("click", () => {
            watchList.toggleWatched(index);
            saveMovies();
            renderMovies();
        });

        toggleCell.append(toggleButton);

        // Column 5: Delete Movie button
        const deleteCell = d.createElement("td");
        const deleteButton = d.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            const userConfirm = confirm("Are you sure you want to delete this movie?");

            if (userConfirm == true) { 
                watchList.removeMovie(index);
                saveMovies();
                renderMovies();
            }
        });

        deleteCell.append(deleteButton);

        // Add the cells to the row, then add the row to the table body
        row.append(titleCell, genreCell, watchedCell, toggleCell, deleteCell);
        movieList.append(row);
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    message.textContent = "";
    message.hidden = true;

    const title = titleInput.value.trim();
    const genre = genreSelect.value;

    // This is, in a way, no longer needed as the submit button is disabled until input is validated.
    // Left in for posterity, and in case there is a way to still bypass the disabled submit button.
    if (title === "") {
        message.textContent = "Enter a movie title.";
        message.hidden = false;
        return;
    } 
    else if (genre === "") {
        message.textContent = "Choose a genre.";
        message.hidden = false;
        return;
    } 
    else {
        // It could JUST be this here, without the else.
        watchList.movies.push({
            title: title,
            genre: genre,
            watched: false
        });

        titleInput.value = "";

        saveMovies();
        renderMovies();

        const newRow = movieList.lastElementChild;
        newRow.className = "new-movie";
    }
});

checkForm();
loadMovies();
renderMovies();