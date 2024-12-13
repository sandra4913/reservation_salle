(function () {

    /*Déclaration des constantes pour accéder aux balises HTML*/
    const table = document.getElementById('planning');
    const btnStatistiques = document.getElementById('btn-statistiques');
    const btnReset = document.getElementById('btn-reset');
    const btnReservationAleatoire = document.getElementById('btn-reservation-aleatoire');
    const statistiques = document.getElementById('statistiques');

    /*Déclaration de la constante pour créer un bouton 'masquer les statistiques'*/
    const btnMasquerStatistiques = document.createElement('button');

    /*Boucle pour créer le tableau*/
    for (let i = 0; i <= 10; i++) {
        let row = document.createElement('tr');
        table.appendChild(row);
        for (let i = 0; i <= 5; i++) {
            let cell = document.createElement('td');
            row.appendChild(cell);
        }
    }

    /*Déclaration de la constante pour accéder aux cellules du tableau que l'on a créé*/
    const cells = document.getElementsByTagName('td');

    /*Déclaration des constantes et création des boucles pour faire apparaitre les jours et les horaires dans le tableau */
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    for (let i = 0; i <= jours.length; i++) {
        cells[i + 1].textContent = jours[i];
    }

    const horaires = ['N° de salle', '8h - 9h', '9h - 10h', '10h - 11h', '11h - 12h', '12h - 13h', '13h - 14h', '14h - 15h', '15h - 16h', '16h - 17h', '17h - 18h'];
    for (let i = 0; i < horaires.length; i++) {
        cells[i * 6].textContent = horaires[i];
    }

    /*Déclaration des variables globales*/
    let clickableCells = [];
    let occupiedCells = [];
    let freeCells = [];
    let numberOfFreeCells;
    let numberOfOccupiedCells;
    let randomSelection;
    let randomlySelectedCell;

    /*Boucle pour séparer les cellules cliquables et les non-cliquables */
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent) {
            cells[i].classList.add('no-click');
        } else if (!cells[i].textContent) {
            clickableCells.push(cells[i]);
        }
    }

    for (let cell of clickableCells) {
        /*Fonction qui permet de réserver ou de libérer un créneau*/
        cell.addEventListener('click', function () {
            if (!cell.className) {
                cell.classList.add('reserve');
            } else if (cell.className) {
                if (window.confirm('Êtes-vous sûr de vouloir libérer ce créneau ?')) {
                    cell.classList.remove('reserve');
                } else {
                    cell.classList.add('reserve');
                }
            }
        })

        /*Fontion qui permet de réinitialiser le tableau*/
        function reinitialiser() {
            if (cell.className) {
                cell.classList.remove('reserve');
            }
        }
        btnReset.addEventListener('click', reinitialiser);

        /*Déclaration de la fonction qui permet de calculer le nombre de créneaux occupés et le nombre de créneaux libres du tableau*/
        function calculerCellulesOccupeesEtLibres() {
            numberOfOccupiedCells = occupiedCells.length;
            numberOfFreeCells = freeCells.length;
            for (let cell of clickableCells) {
                if (!cell.className) {
                    numberOfFreeCells++;
                } else {
                    numberOfOccupiedCells++;
                }
            }
        }

        /*Déclaration et appel de la fonction qui permettra de réserver de façon aléatoire*/
        function reserverAleatoirement() {
            calculerCellulesOccupeesEtLibres();
            let numberOfWantedCells = window.prompt('Combien de créneaux souhaitez-vous réserver ?');

            /*Premier cas : si le nombre de créneaux voulus est inférieur à 0*/
            if (numberOfWantedCells <= 0) {
                window.alert('Vous devez réserver au moins un créneau.');

                /*Deuxième cas : si le nombre de créneaux voulus est supérieur au nombre de cellules disponibles du tableau*/
            } else if (numberOfWantedCells > numberOfFreeCells) {
                window.alert('Vous ne pouvez pas réserver autant de créneaux. ' + numberOfFreeCells + ' créneaux sont disponibles.');

                /*Troisième cas : si le nombre de créneaux voulus est compris entre 1 et le nombre de cellules disponibles du tableau*/
            } else if (numberOfWantedCells > 0 && numberOfWantedCells <= numberOfFreeCells) {
                for (let i = 0; i < numberOfWantedCells; i++) {
                    randomSelection = Math.floor(Math.random() * clickableCells.length);
                    randomlySelectedCell = clickableCells[randomSelection];
                    randomlySelectedCell.classList.add('reserve');
                    clickableCells.splice(randomSelection, 1);
                    occupiedCells.push(randomSelection);
                    numberOfFreeCells--;
                    btnReset.addEventListener('click', function () {
                        while (randomlySelectedCell && clickableCells.length < 50) {
                            for (let cell of clickableCells) {
                                cell.classList.remove('reserve');
                            }
                            occupiedCells.pop(cell);
                            clickableCells.push(cell);
                            numberOfFreeCells++;
                        }
                    })
                }

                /*Dernier cas, si aucune des conditions précédentes ne fonctionne*/
            } else {
                window.alert('Vous devez saisir des données numériques uniquement.');
            }
        }
    }


    /*Déclaration et appel de la fonction qui indiquera les statistiques*/
    function donnerStat() {
        calculerCellulesOccupeesEtLibres();
        statistiques.style.display = 'block';
        statistiques.innerHTML += 'Nombre de créneaux libres : ' + numberOfFreeCells + '<br>' + '<br>';
        statistiques.innerHTML += 'Nombre de créneaux occupés : ' + numberOfOccupiedCells;
        btnStatistiques.style.display = 'none';
        statistiques.appendChild(btnMasquerStatistiques);
        btnMasquerStatistiques.style.display = 'block';
        btnMasquerStatistiques.textContent = 'Masquer les statistiques';
    }
    btnStatistiques.addEventListener('click', donnerStat);

    /*Déclaration et appel de la fonction qui masquera les statistiques*/
    function masquerStat() {
        statistiques.innerHTML = '';
        statistiques.style.display = 'none';
        btnMasquerStatistiques.style.display = 'none';
        btnStatistiques.style.display = 'block';
    }
    btnMasquerStatistiques.addEventListener('click', masquerStat);

    btnReservationAleatoire.addEventListener('click', reserverAleatoirement);

})()