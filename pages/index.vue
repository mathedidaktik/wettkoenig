<template>

    <div id="x-top-level-container" class="flex h-full w-full flex-wrap flex-row justify-between">
        <div id="y-dice-control-container" class="flex flex-col grow w-full lg:w-1/5 xl:w-1/5 p-4">

            <div id="x-dices-container" class="flex flex-row space-x-4 mt-1">
                <div class="y-dice-container flex flex-col grow lg:w-1/2 xl:w-1/2">
                    <Dice ref="dice1" :id="0" @dice-changed="setTableToZero"></Dice>
                    <div class="flex flex-col space-y-8">
                        <button type="button" @click="rollDice1" class="button text-white rounded-md px-4 py-2 mt-4 mb-4">Würfeln</button>    
                    </div>
                </div>
                
                <div class="y-dice-container flex flex-col grow lg:w-1/2 xl:w-1/2" v-if="secondDice">
                    <Dice ref="dice2" :id="1" @dice-changed="setTableToZero"><div class="flex flex-col space-y-8">
                        <button type="button" @click="rollDice2" class="button text-white rounded-md px-4 py-2 mt-4 mb-4">Würfeln</button>
                    </div></Dice>
                    
                </div>
            </div>
            <button @click="secondDiceCheck" class="button text-white rounded-md px-4 p-4 m-0" v-if="!secondDice">Nutze zwei Würfel</button>
            <button @click="secondDiceCheck" class="button text-white rounded-md px-4 p-4 m-0" v-if="secondDice">Nutze einen Würfel</button>
        </div>
        
        <div id="canvas-container" class="w-full lg:w-3/5 xl:w-3/5 p-4 flex min-h-0 relative grow flex-col">
            <button type="button" @click="changeChart" class="button text-white rounded-md px-4 py-2 m-0">Layout ändern</button>
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
                secondDice: false,
                chart: null,
                chartData: {
                    labels: ['Rot', 'Gelb', 'Blau', 'Hellblau', 'Grün', 'Orange', 'Pink', 'Schwarz'],
                    datasets: [
                    {
                        //axis: 'y',
                        label: 'Würfel 1',
                        backgroundColor: ['rgba(230, 51, 42, 0.2)', 'rgba(255, 204, 0, 0.2)', 'rgba(0,53,96, 0.3)', 'rgba(86, 180, 233, 0.5)', 
                        'rgba(0, 158, 115, 0.5)', 'rgba(230, 159, 0, 0.5)', 'rgba(204, 121, 167, 0.5)', 'rgba(0, 0, 0, 0.3)'],
                        borderColor: ['rgb(230, 51, 42)', 'rgb(255, 204, 0)', 'rgb(0,53,96)', 'rgb(86, 180, 233)', 
                        'rgb(0, 158, 115)', 'rgb(230, 159, 0)', 'rgb(204, 121, 167)', 'rgb(0, 0, 0)'],
                        borderWidth: 1,
                        data: [0, 0, 0, 0, 0, 0, 0, 0],
                    },
                    {
                        //axis: 'y',
                        label: 'Würfel 2',
                        backgroundColor: ['rgba(230, 51, 42, 0.2)', 'rgba(255, 204, 0, 0.2)', 'rgba(0,53,96, 0.3)', 'rgba(86, 180, 233, 0.5)', 
                        'rgba(0, 158, 115, 0.5)', 'rgba(230, 159, 0, 0.5)', 'rgba(204, 121, 167, 0.5)', 'rgba(0, 0, 0, 0.3)'],
                        borderColor: ['rgb(230, 51, 42)', 'rgb(255, 204, 0)', 'rgb(0,53,96)', 'rgb(86, 180, 233)', 
                        'rgb(0, 158, 115)', 'rgb(230, 159, 0)', 'rgb(204, 121, 167)', 'rgb(0, 0, 0)'],
                        borderWidth: 1,
                        data: [0, 0, 0, 0, 0, 0, 0, 0],
                    },
                    ]     
               },
                chartOptions: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins:{
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return (
                                        context.dataset.label
                                    );
                                },
                            },
                        },
                        legend: {
                            display:false
                        },
                        title: {
                            display: true,
                            text: "H\u00e4ufigkeitsverteilung",
                            color: "black",
                            font: {
                                family: "'Arial', 'Helvetica', 'sans-serif'",
                                size: 18,
                            },

                        },
                    },
                    scales: {
                        y: {
                        //beginAtZero: true,
                        },
                        x: {
                            max: 100,
                            min: 0,
                            ticks: {
                                stepSize: 10,
                                callback: function(value, index, ticks) {
                                    return value + '%';
                                }
                            }
                        }
                    }                
                }
            }
        },
        methods: {
            secondDiceCheck() {
                let dice2 = this.$refs.dice2;
                if (dice2) {
                    dice2.sidesInputsCount = 3;
                }
                this.secondDice = !this.secondDice;
                this.setTableToZero(1);
                
            },
            setTableToZero(diceId) {
                
                this.myChart.data.datasets[diceId].data = [0, 0, 0, 0, 0, 0, 0, 0];
                this.myChart.update();
        
            },
            displayChart(rolls, numberOfRolls , datasetIndex) {
            // Generate data for the chart based on rolls
                let sidesCount = 0;

                let dice1 = this.$refs.dice1;
                if(this.secondDice) {
                    let dice2 = this.$refs.dice2;
            
                    if (dice1.sidesInputsCount < dice2.sidesInputsCount){
                        sidesCount = dice2.sidesInputsCount;
                    }
                    else {
                        sidesCount = dice1.sidesInputsCount;
                    }
                } 
                else {sidesCount = dice1.sidesInputsCount;}

                var allData = [
                {rank: 1, label: 'Rot', value: ((rolls.filter(roll => roll === 'red').length) / numberOfRolls) * 100},
                {rank: 2, label: 'Gelb', value: ((rolls.filter(roll => roll === 'yellow').length) / numberOfRolls) * 100},
                {rank: 3, label: 'Blau', value: ((rolls.filter(roll => roll === 'blue').length) / numberOfRolls) * 100},
                {rank: 4, label: 'Hellblau', value: ((rolls.filter(roll => roll === 'lightblue').length) / numberOfRolls) * 100},
                {rank: 5, label: 'Grün', value: ((rolls.filter(roll => roll === 'green').length) / numberOfRolls) * 100},
                {rank: 6, label: 'Orange', value: ((rolls.filter(roll => roll === 'orange').length) / numberOfRolls) * 100},
                {rank: 7, label: 'Pink', value: ((rolls.filter(roll => roll === 'pink').length) / numberOfRolls) * 100},
                {rank: 8, label: 'Schwarz', value: ((rolls.filter(roll => roll === 'black').length) / numberOfRolls) * 100},
                ]

                var newData = allData.filter(data => data.rank <= sidesCount).map(data => data.value);
                var newLabels = allData.filter(data => data.rank <= sidesCount).map(data => data.label);

                this.myChart.data.labels = newLabels;
                this.myChart.data.datasets[datasetIndex].data = newData;

                this.myChart.update();   
                    
            },
            rollDice1() {
                let dice1 = this.$refs.dice1;

                if (dice1.warningRolls | dice1.warningSites) {
                    this.displayChart([], 0, 0);
                    return;
                }
                dice1.rollDice();
                this.displayChart(dice1.rolls, dice1.numberOfRolls, 0);
            },

            rollDice2(){
                let dice2 = this.$refs.dice2;

                if (dice2.warningRolls | dice2.warningSites) {
                    this.displayChart([], 0, 1);
                    return;
                }
                dice2.rollDice();
                this.displayChart(dice2.rolls, dice2.numberOfRolls, 1);
            },
            
            changeChart() {
                this.myChart.options.indexAxis = this.myChart.options.indexAxis === 'x' ? 'y' : 'x';

                let scalesX = lodash.cloneDeep(this.myChart.options.scales.x);
                this.myChart.options.scales.x = lodash.cloneDeep(this.myChart.options.scales.y);
                this.myChart.options.scales.y = scalesX;

                this.myChart.update();
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
  
  
  
  