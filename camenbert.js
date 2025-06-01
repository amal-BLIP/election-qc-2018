// Charger les données GeoJSON et afficher un camembert avec Chart.js
fetch('circo-electo-electo-2022-reprojete-2.geojson')
    .then(response => response.json())
    .then(data => {
        const partyColors = {
            'C.A.Q.-E.F.L.': '#87CEEB', // Bleu clair
            'P.L.Q./Q.L.P.': '#FF0000',  // Rouge
            'P.Q.': '#00008B',          // Bleu foncé
            'Q.S.': '#FFA500'           // Orange
        };

        let votesParParti = {};

        // Parcourir chaque circonscription
        data.features.forEach(feature => {
            let partiVainqueur = feature.properties['candidats_Abreviation du parti politique']; // Colonne du parti gagnant
            let votesAvance = feature.properties['candidats_Nombre de votes en avance']; // Nombre de votes d'avance

            if (partiVainqueur && votesAvance) {
                votesAvance = parseInt(votesAvance, 10);
                if (!isNaN(votesAvance)) {
                    votesParParti[partiVainqueur] = (votesParParti[partiVainqueur] || 0) + votesAvance;
                }
            }
        });

        // Convertir les données pour Chart.js
        const labels = Object.keys(votesParParti);
        const dataValues = labels.map(parti => votesParParti[parti]);
        const colors = labels.map(parti => partyColors[parti] || '#CCCCCC'); // Gris si parti inconnu

        // Création du camembert avec Chart.js
        const ctx = document.getElementById('pieChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));
