<template>
    <dev class="flex w-full flex-wrap flex-row justify-between">
        <label class="w-full button text-white rounded-md px-4 p-4 m-0 mt-2 ml-4 mr-4 text-center text-3xl">Wettlauf</label>
    </dev>
    <div id="x-top-level-container" class="flex h-full w-full flex-wrap flex-row justify-between">
        <div id="y-dice-control-container" class="flex flex-col grow w-full lg:w-1/5 xl:w-1/5 p-4">
            <div id="x-dices-container" class="flex flex-row space-x-4 mt-1">
                <div class="y-dice-container flex flex-col grow lg:w-1/2 xl:w-1/2">
                    <Dice ref="dice" @rollDice="rollDice"></Dice>
                </div>
            </div>
        </div>
        
        <div id="canvas-container" class="w-full lg:w-3/5 xl:w-3/5 p-4 flex min-h-0 relative grow flex-col">
            <figure>
                <canvas ref="myChart" class="w-full h-full mt-1"></canvas>
            </figure>

        </div>
    </div>
</template>
  
<script>
    
    import { Ticks } from 'chart.js';
    import { Chart } from 'chart.js/auto';
    import { Bundle } from 'magic-string';
    import lodash from "lodash";

  
export default{
        data() {
            return {
                chartHorizontal: true,
                chart: null,
                chartData: {
                    labels: ['Rot', 'Grün', 'Gelb', 'Blau'],
                    datasets: [
                    {
                        label: 'Würfel',
                        backgroundColor: ['rgba(235, 50, 36, 1)', 'rgba(117, 249, 78, 1)', 'rgba(254, 253, 86, 1)', 'rgba(58, 105, 245, 1)'],
                        borderColor: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0,0,0)', 'rgb(0, 0, 0)'],
                        borderWidth: 1,
                        data: [0, 0, 0, 0],
                        rolls: [0, 0, 0, 0],
                        labels: ['Rot', 'Grün', 'Gelb', 'Blau'],
                    },
                    ]     
               },
                chartOptions: {
                    indexAxis: 'x',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins:{
                        tooltip: {
                            callbacks: {
                                title: function (tooltipItems) {
                                    return "Würfel";
                                },
                                label: function (context) {                              
                                return (
                                    context.label +
                                    ': ' +
                                    context.dataset.rolls[context.dataIndex] +
                                    '-mal geworfen' +
                                    ' (' +
                                    Math.round(context.dataset.data[context.dataIndex]) +
                                    '%)'
                                );
                                },
                            },
                            },
                        legend: {
                            display:false
                        },
                        title: {
                            display: true,
                            text: "Häufigkeitsverteilung",
                            color: "black",
                            font: {
                                family: "'Arial', 'Helvetica', 'sans-serif'",
                                size: 18,
                            },

                        },
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                        y: {
                            max: 100,
                            min: 0,
                            ticks: {
                                stepSize: 10,
                                callback: function(value, index, ticks) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 1500,                   
                    }         
                }
            }
        },
        methods: {
            updateChart() {
                let dice = this.$refs.dice;
                if (( dice.numberOfRolls == 1)) {
                    this.myChart.options.animation.duration = 0;
                }
                
                this.myChart.update();

            },
            setTableToZero() {
                
                this.myChart.data.datasets[0].data = [0, 0, 0, 0];
                this.myChart.stop();
                this.myChart.update();
        
            },
            displayChart(rolls, numberOfRolls) {

                this.myChart.options.animation.duration = 0;
                this.setTableToZero();
                this.myChart.options.animation.duration = 1500

                var allData = [
                {rank: 1, label: 'Rot', value: ((rolls.filter(roll => roll === 'red').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'red').length), sides: 7},
                {rank: 2, label: 'Grün', value: ((rolls.filter(roll => roll === 'green').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'green').length), sides: 5},
                {rank: 3, label: 'Gelb', value: ((rolls.filter(roll => roll === 'yellow').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'yellow').length), sides: 5},
                {rank: 4, label: 'Blau', value: ((rolls.filter(roll => roll === 'blue').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'blue').length), sides: 3},
                ]

                var newData = allData.map(data => data.value);
                var newRolls = allData.map(data => data.rolls);

                this.myChart.data.datasets[0].rolls = newRolls;
                this.myChart.data.datasets[0].data = newData;

                this.updateChart();  
                    
            },
            rollDice() {
                let dice = this.$refs.dice;

                if (dice.warningRolls || dice.warningSites) {
                    
                    this.displayChart([], 0);
                    return;
                }
                this.displayChart(dice.rolls, dice.numberOfRolls);
            },
        },

        mounted() {
            let ctx = this.$refs.myChart.getContext('2d');
            this.myChart = new Chart(ctx, {
            type: 'bar',
            data: this.chartData,
            options: this.chartOptions
            });
            
        },
       
    }
</script>
  
  
  
  