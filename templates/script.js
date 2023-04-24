 // Ajouter des événements de clic pour les liens de pagination
 function swipPage(e) {
     currentPage = parseInt(e.getAttribute("data-page"));
  document.querySelectorAll(".currentPage").forEach(function (element) {
                    element.classList.remove("currentPage")
                });
     e.classList.add("currentPage");
     //alert(currentPage);
     getFilms();
 }

 // Initialiser les valeurs par défaut
 var currentPage = 1;
 var perPage = 10;
 var sortBy = "title";
 var sortDir = "asc";

 var filmsTable = document.getElementById("films-table");
 var pagination = document.querySelector(".pagination");

 document
     .getElementById("paginationNombre")
     .addEventListener("change", function () {
        current_page = this.value
         console.log(this.value);
         perPage = this.value;
         this.setAttribute("disabled", true);
         getFilms();
     });

 // Fonction pour récupérer les films triés et paginés à partir de l'API
 function getFilms() {
     var xhr = new XMLHttpRequest();
     xhr.onreadystatechange = function () {
         if (xhr.readyState === XMLHttpRequest.DONE) {
             if (xhr.status === 200) {
                 var data = JSON.parse(xhr.responseText);

                 // Ajouter les films à la table
                 filmsTable.innerHTML = "";
                 data.data.forEach(function (film) {
                     var row = document.createElement("tr");
                     row.innerHTML =
                         "<td>" +
                         film.title +
                         "</td><td>" +
                         film.rental_rate +
                         "</td><td>" +
                         film.rating +
                         "</td><td>" +
                         film.category_name +
                         "</td><td>" +
                         film.rental_count +
                         "</td>";
                     filmsTable.appendChild(row);
                 });

                 // Ajouter les liens de pagination
                 pagination.innerHTML = "";
                 var maxPages = 3;
                 var startPage = Math.max(
                     1,
                     currentPage - Math.floor(maxPages / 2)
                 );
                 var endPage = Math.min(
                     data.total_pages,
                     startPage + maxPages - 1
                 );
                 
                 if (endPage - startPage < maxPages - 1) {
                     startPage = Math.max(1, endPage - maxPages + 1);
                 }
                 if (startPage > 1) {
                     var firstPageLink = document.createElement("a");
                     firstPageLink.href = "#";
                     firstPageLink.innerHTML = "1";
                     firstPageLink.setAttribute("data-page", 1);
                     firstPageLink.classList.add("page-link");
                     firstPageLink.setAttribute("onclick", "swipPage(this)");
                     var firstPageItem = document.createElement("li");
                     firstPageItem.classList.add("page-item");
                     firstPageItem.appendChild(firstPageLink);
                     pagination.appendChild(firstPageItem);
                     var ellipsisItem = document.createElement("li");
                     ellipsisItem.classList.add("page-item");
                     ellipsisItem.innerHTML =
                         '<span class="ellipsis">&hellip;</span>';
                     pagination.appendChild(ellipsisItem);
                 }
                 // Ajouter des événements de clic pour les liens de pagination
                 for (var i = startPage; i <= endPage; i++) {
                     var pageLink = document.createElement("a");
                     pageLink.href = "#";
                     pageLink.innerHTML = i;
                     pageLink.setAttribute("data-page", i);
                     pageLink.classList.add("page-link");
                     pageLink.setAttribute("onclick", "swipPage(this)");
                     if (i === currentPage) {
                         pageLink.classList.add("active");
                     }
                     var pageItem = document.createElement("li");
                     pageItem.classList.add("page-item");
                     pageItem.appendChild(pageLink);
                     pagination.appendChild(pageItem);
                 }
                 if (endPage < data.total_pages) {
                     var ellipsisItem = document.createElement("li");
                     ellipsisItem.classList.add("page-item");
                     ellipsisItem.innerHTML =
                         '<span class="ellipsis">&hellip;</span>';
                     pagination.appendChild(ellipsisItem);
                     var lastPageLink = document.createElement("a");
                     lastPageLink.href = "#";
                     lastPageLink.innerHTML = data.total_pages;
                     lastPageLink.setAttribute("data-page", data.total_pages);
                     lastPageLink.setAttribute("onclick", "swipPage(this)");
                     lastPageLink.classList.add("page-link");
                     var lastPageItem = document.createElement("li");
                     lastPageItem.classList.add("page-item");
                     lastPageItem.appendChild(lastPageLink);
                     pagination.appendChild(lastPageItem);
                 }
                 document
                     .getElementById("paginationNombre")
                     .removeAttribute("disabled");
             }
         }
     };

     xhr.open(
         "GET",
         "https://sakila-xyf8.onrender.com/films?page=" +
         currentPage +
         "&per_page=" +
         perPage +
         "&sort_by=" +
         sortBy +
         "&sort_dir=" +
         sortDir,
         true
     );
     xhr.send();
 }

 // Fonction pour changer le tri des films
 function sortFilms(sortB, sortDi) {
     currentPage = 1;
     sortBy = sortB;
     sortDir = sortDi;
     getFilms();
 }

 // Appeler la fonction pour récupérer les films triés et paginés au chargement de la page
 getFilms();

 function addCSSRule(sheet, selector, rules, index) {
     if (sheet.insertRule) {
         sheet.insertRule(selector + "{" + rules + "}", index);
     } else if (sheet.addRule) {
         sheet.addRule(selector, rules, index);
     }
 }

 // Ajouter des événements de clic pour les liens de tri
 var sortLinks = document.querySelectorAll(".sort");
 sortLinks.forEach(function (sortLink) {
     sortLink.addEventListener("click", function () {
         var sortBy = this.getAttribute("data-sort-by");

         if (this.classList.contains("selected")) {
             this.classList.remove("selected");
         } else {
             // Ajoutez la classe "selected" à l'élément cliqué
             this.classList.add("selected");
             //parcourir les liens de tri et supprimer la classe "selected" des autres liens
                sortLinks.forEach(function (link) {
                    if (link !== sortLink) {
                        link.classList.remove("selected");
                    }
                });
                
             
         }

         if (sortDir == "asc") {
             sortDir = "desc";
         } else {
             sortDir = "asc";
         }
         sortFilms(sortBy, sortDir);
     });
 });

 //code JavaScript pour gérer le bouton de visite et la fermeture de la pop-up
 document
     .getElementById("visit-btn")
     .addEventListener("click", function () {
         document.querySelector(".github-link").style.color = "#ff5722";
         document.getElementById("popup-bg").style.display = "none";
     });
