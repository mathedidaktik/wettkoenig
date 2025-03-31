document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const rollsInput = document.getElementById('rolls');
    const rollButton = document.getElementById('roll-button');
    const ameiseCount = document.getElementById('ameise-count');
    const froschCount = document.getElementById('frosch-count');
    const schneckeCount = document.getElementById('schnecke-count');
    const igelCount = document.getElementById('igel-count');
    const resultsChart = document.getElementById('results-chart');
    
    // Chart instance
    let chart;
    
    // Animals config
    const animals = [
        { name: 'Ameise', color: '#d33d2e' },
        { name: 'Frosch', color: '#a5bc43' },
        { name: 'Schnecke', color: '#eee46a' },
        { name: 'Igel', color: '#75bcd1' }
    ];
    
    // Initialize chart
    function initChart() {
        chart = new Chart(resultsChart, {
            type: 'bar',
            data: {
                labels: animals.map(animal => ''),
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: animals.map(animal => animal.color),
                    borderColor: animals.map(animal => animal.color),
                    borderWidth: 1,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = animals[context.dataIndex].name;
                                const value = context.raw;
                                return `${label}: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1000,
                        grid: {
                            color: '#e0e0e0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Roll dice function
    function rollDice() {
        const numRolls = parseInt(rollsInput.value);
        if (isNaN(numRolls) || numRolls <= 0 || numRolls > 1000000) {
            alert('Bitte geben Sie eine gültige Anzahl von Würfen ein.');
            return;
        }

        // Erst Diagramm leeren
        chart.data.datasets[0].data = [0, 0, 0, 0];
        chart.update('none');

        // Zufallssimulation 
        const results = {
            'Ameise': 0,
            'Frosch': 0,
            'Schnecke': 0,
            'Igel': 0
        };
        
        // Echte Zufallssimulation für jeden Wurf
        for (let i = 0; i < numRolls; i++) {
            const roll = Math.floor(Math.random() * 20) + 1; // 1-20
            
            if (roll <= 7) {
                // 1-7: Ameise (rot)
                results['Ameise']++;
            } else if (roll <= 12) {
                // 8-12: Frosch (grün)
                results['Frosch']++;
            } else if (roll <= 17) {
                // 13-17: Schnecke (gelb)
                results['Schnecke']++;
            } else {
                // 18-20: Igel (blau)
                results['Igel']++;
            }
        }
        
        // Update counts
        ameiseCount.textContent = results['Ameise'];
        froschCount.textContent = results['Frosch'];
        schneckeCount.textContent = results['Schnecke'];
        igelCount.textContent = results['Igel'];
        
        // Update chart
        chart.data.datasets[0].data = [
            results['Ameise'],
            results['Frosch'],
            results['Schnecke'],
            results['Igel']
        ];
        
        // Update counts
        ameiseCount.textContent = results['Ameise'];
        froschCount.textContent = results['Frosch'];
        schneckeCount.textContent = results['Schnecke'];
        igelCount.textContent = results['Igel'];
        
        // Update chart
        chart.data.datasets[0].data = [
            results['Ameise'],
            results['Frosch'],
            results['Schnecke'],
            results['Igel']
        ];
        
        // Adjust y-axis scale based on number of rolls
        chart.options.scales.y.max = numRolls;
        chart.options.animation.duration = 1500;
        
        chart.update();
    }
    
    // Initialize
    initChart();
    
    // Event listeners
    rollButton.addEventListener('click', rollDice);
    
    // Initial roll
    //rollDice();
});
