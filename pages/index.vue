<template>
    <dev class="flex w-full flex-wrap flex-row justify-between">
        <label class="w-full button text-white rounded-md px-4 p-4 m-0 mt-2 ml-4 mr-4 text-center text-3xl">Wettlauf</label>
    </dev>
    <div id="x-top-level-container" class="flex h-full w-full flex-wrap flex-row justify-between">
        <div id="y-dice-control-container" class="flex flex-col grow w-full lg:w-1/5 xl:w-1/5 p-4">

            <div id="x-dices-container" class="flex flex-row space-x-4 mt-1">
                <div class="y-dice-container flex flex-col grow lg:w-1/2 xl:w-1/2">
                    <Dice ref="dice1" :id="0" @dice-changed="setTableToZero" @rollDice1="rollDice1"></Dice>
                </div>
                
                <div class="y-dice-container flex flex-col grow lg:w-1/2 xl:w-1/2" v-if="secondDice">
                    <Dice ref="dice2" :id="1" @dice-changed="setTableToZero" @rollDice2="rollDice2"></Dice>
                </div>
            </div>
            <button @click="secondDiceCheck" class="button text-white rounded-md px-4 p-4 m-0 mt-2" v-if="!secondDice">Nutze zwei Würfel</button>
            <button @click="secondDiceCheck" class="button text-white rounded-md px-4 p-4 m-0 mt-2" v-if="secondDice">Nutze einen Würfel</button>
        </div>
        
        <div id="canvas-container" class="w-full lg:w-3/5 xl:w-3/5 p-4 flex min-h-0 relative grow flex-col">
            <button v-if="chartHorizontal" type="button" @click="changeChart" class="button text-white rounded-md px-4 py-2 m-0">Zu Vertikalem Balkendiagramm wechseln</button>
            <button v-if="!chartHorizontal" type="button" @click="changeChart" class="button text-white rounded-md px-4 py-2 m-0">Zu Horizontalem Balkendiagramm wechseln</button>

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
                chartHorizontal: true,
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
                        rolls: [0, 0, 0, 0, 0, 0, 0, 0]
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
                        rolls: [0, 0, 0, 0, 0, 0, 0, 0]
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
                                        context.dataset.label +
                                        ": " +
                                        context.dataset.rolls[context.dataIndex] +
                                        " Würfe" +
                                        " (" +
                                        Math.round(
                                        context.dataset.data[context.dataIndex] 
                                        ) +
                                        "%)"
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
                        y: {
                            beginAtZero: true,
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
                    },
                    animation: {
                        duration: 1500,
                        //easing: "linear",                   
                    }         
                }
            }
        },
        methods: {
            updateChart(diceIndex) {
                let dice1 = this.$refs.dice1;
                let dice2;
                if(this.secondDice) {
                    dice2 = this.$refs.dice2;
                }
                if ((diceIndex == 0 & dice1.numberOfRolls == 1) | (diceIndex == 1 && dice2.numberOfRolls == 1)) {
                    this.myChart.options.animation.duration = 0;
                }
                this.myChart.stop();
                this.myChart.update();

                this.myChart.options.animation.duration = 1500;
            },
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

                this.myChart.options.animation.duration = 0;
                this.setTableToZero(datasetIndex);
                this.myChart.options.animation.duration = 1500;

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
                {rank: 1, label: 'Rot', value: ((rolls.filter(roll => roll === 'red').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'red').length)},
                {rank: 2, label: 'Gelb', value: ((rolls.filter(roll => roll === 'yellow').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'yellow').length)},
                {rank: 3, label: 'Blau', value: ((rolls.filter(roll => roll === 'blue').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'blue').length)},
                {rank: 4, label: 'Hellblau', value: ((rolls.filter(roll => roll === 'lightblue').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'lightblue').length)},
                {rank: 5, label: 'Grün', value: ((rolls.filter(roll => roll === 'green').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'green').length)},
                {rank: 6, label: 'Orange', value: ((rolls.filter(roll => roll === 'orange').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'orange').length)},
                {rank: 7, label: 'Pink', value: ((rolls.filter(roll => roll === 'pink').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'pink').length)},
                {rank: 8, label: 'Schwarz', value: ((rolls.filter(roll => roll === 'black').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'black').length)},
                ]

                var newData = allData.filter(data => data.rank <= sidesCount).map(data => data.value);
                var newLabels = allData.filter(data => data.rank <= sidesCount).map(data => data.label);
                var newRolls = allData.filter(data => data.rank <= sidesCount).map(data => data.rolls);


                this.myChart.data.datasets[datasetIndex].rolls = newRolls;
                this.myChart.data.labels = newLabels;
                this.myChart.data.datasets[datasetIndex].data = newData;

                this.updateChart(datasetIndex);  
                    
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
                this.chartHorizontal = !this.chartHorizontal;
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
  
  
  
  