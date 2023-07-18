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
                        backgroundColor: ['rgba(213, 94, 0, 0.4)', 'rgba(240, 228, 66, 0.2)', 'rgba(0, 114, 178, 0.3)', 'rgba(86, 180, 233, 0.5)', 
                        'rgba(0, 158, 115, 0.5)', 'rgba(230, 159, 0, 0.5)', 'rgba(204, 121, 167, 0.5)', 'rgba(0, 0, 0, 0.3)'],
                        borderColor: ['rgb(213, 94, 0)', 'rgb(240, 228, 66)', 'rgb(0,114,178)', 'rgb(86, 180, 233)', 
                        'rgb(0, 158, 115)', 'rgb(230, 159, 0)', 'rgb(204, 121, 167)', 'rgb(0, 0, 0)'],
                        borderWidth: 1,
                        data: [0, 0, 0, 0, 0, 0, 0, 0],
                        rolls: [0, 0, 0, 0, 0, 0, 0, 0],
                        labels: ['Rot', 'Gelb', 'Blau', 'Hellblau', 'Grün', 'Orange', 'Pink', 'Schwarz'],
                    },
                    {
                        //axis: 'y',
                        label: 'Würfel 2',
                        backgroundColor: ['rgba(213, 94, 0, 0.4)', 'rgba(240, 228, 66, 0.2)', 'rgba(0, 114, 178, 0.3)', 'rgba(86, 180, 233, 0.5)', 
                        'rgba(0, 158, 115, 0.5)', 'rgba(230, 159, 0, 0.5)', 'rgba(204, 121, 167, 0.5)', 'rgba(0, 0, 0, 0.3)'],
                        borderColor: ['rgb(213, 94, 0)', 'rgb(240, 228, 66)', 'rgb(0,114,178)', 'rgb(86, 180, 233)', 
                        'rgb(0, 158, 115)', 'rgb(230, 159, 0)', 'rgb(204, 121, 167)', 'rgb(0, 0, 0)'],
                        borderWidth: 1,
                        data: [0, 0, 0, 0, 0, 0, 0, 0],
                        rolls: [0, 0, 0, 0, 0, 0, 0, 0],
                        labels: ['Rot', 'Gelb', 'Blau', 'Hellblau', 'Grün', 'Orange', 'Pink', 'Schwarz'],
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
                                title: function (tooltipItems) {
                                    if (tooltipItems[0].datasetIndex == 0) {
                                        return "Würfel 1";
                                    }
                                    else {
                                        return "Würfel 2";
                                    }
                                    
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
                this.myChart.stop();
                this.myChart.update();
        
            },
            displayChart(rolls, numberOfRolls , diceSidesInfo, diceSidesInfoOther, datasetIndex) {
            // Generate data for the chart based on rolls

                this.myChart.options.animation.duration = 0;
                this.setTableToZero(datasetIndex);
                this.myChart.options.animation.duration = 1500

                let backgroundColor = ['rgba(213, 94, 0, 0.4)', 'rgba(240, 228, 66, 0.2)', 'rgba(0, 114, 178, 0.3)', 'rgba(86, 180, 233, 0.5)', 
                        'rgba(0, 158, 115, 0.5)', 'rgba(230, 159, 0, 0.5)', 'rgba(204, 121, 167, 0.5)', 'rgba(0, 0, 0, 0.3)'];
                let borderColor = ['rgb(213, 94, 0)', 'rgb(240, 228, 66)', 'rgb(0,114,178)', 'rgb(86, 180, 233)', 
                        'rgb(0, 158, 115)', 'rgb(230, 159, 0)', 'rgb(204, 121, 167)', 'rgb(0, 0, 0)'];

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
                {rank: 1, label: 'Rot', value: ((rolls.filter(roll => roll === 'red').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'red').length), sides: diceSidesInfo[0].sides},
                {rank: 2, label: 'Gelb', value: ((rolls.filter(roll => roll === 'yellow').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'yellow').length), sides: diceSidesInfo[1].sides},
                {rank: 3, label: 'Blau', value: ((rolls.filter(roll => roll === 'blue').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'blue').length), sides: diceSidesInfo[2].sides},
                {rank: 4, label: 'Hellblau', value: ((rolls.filter(roll => roll === 'lightblue').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'lightblue').length), sides: diceSidesInfo[3].sides},
                {rank: 5, label: 'Grün', value: ((rolls.filter(roll => roll === 'green').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'green').length), sides: diceSidesInfo[4].sides},
                {rank: 6, label: 'Orange', value: ((rolls.filter(roll => roll === 'orange').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'orange').length), sides: diceSidesInfo[5].sides},
                {rank: 7, label: 'Pink', value: ((rolls.filter(roll => roll === 'pink').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'pink').length), sides: diceSidesInfo[6].sides},
                {rank: 8, label: 'Schwarz', value: ((rolls.filter(roll => roll === 'black').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'black').length), sides: diceSidesInfo[7].sides},
                ]

                if (diceSidesInfoOther.length != 0) {
                    var newData = allData.filter(data => (data.rank <= sidesCount & (data.sides > 0 |diceSidesInfoOther[data.rank-1].sides > 0))).map(data => data.value);
                    var newLabels = allData.filter(data => (data.rank <= sidesCount & (data.sides > 0 |diceSidesInfoOther[data.rank-1].sides > 0))).map(data => data.label);
                    var newRolls = allData.filter(data => (data.rank <= sidesCount & (data.sides > 0 |diceSidesInfoOther[data.rank-1].sides > 0))).map(data => data.rolls);
                }
                else {
                    var newData = allData.filter(data => (data.rank <= sidesCount & data.sides > 0)).map(data => data.value);
                    var newLabels = allData.filter(data => (data.rank <= sidesCount & data.sides > 0)).map(data => data.label);
                    var newRolls = allData.filter(data => (data.rank <= sidesCount & data.sides > 0)).map(data => data.rolls);
                }

                var newColor = [];
                var newBorderColor = [];

                for (var i = 0; i <= sidesCount; i++) {
                    //Farben bei denen einer der beiden Würfel eine Seitenanzahl größer 0 hat müssen vorkommen
                    if (diceSidesInfoOther.length != 0) {
                        if (diceSidesInfo[i].sides > 0 | diceSidesInfoOther[i].sides > 0) {
                            newColor.push(backgroundColor[i]);
                            newBorderColor.push(borderColor[i]);
                        }
                    }
                    else {
                        if (diceSidesInfo[i].sides > 0) {
                            newColor.push(backgroundColor[i]);
                            newBorderColor.push(borderColor[i]);
                        }
                    }
                }

                if (datasetIndex == 0 && diceSidesInfoOther.length != 0) {
                    let dice2NewData = [];
                    let dice2NewRolls = [];

                    let bias = 0;

                    for (let i = 0; i < newLabels.length; i++) {
                        
                        if (this.myChart.data.datasets[1].labels.includes(newLabels[i])) {
                            dice2NewData.push(this.myChart.data.datasets[1].data[i - bias]);
                            dice2NewRolls.push(this.myChart.data.datasets[1].rolls[i - bias]);
                        }
                        else {
                            dice2NewData.push(0);
                            dice2NewRolls.push(0);
                            bias++;
                        }
                    }
                    this.myChart.data.datasets[1].rolls = dice2NewRolls;
                    this.myChart.data.datasets[1].labels = newLabels;
                    this.myChart.data.datasets[1].data = dice2NewData;
                    this.myChart.data.datasets[1].backgroundColor = newColor;
                    this.myChart.data.datasets[1].borderColor = newBorderColor;
                }
                else if (datasetIndex == 1) {
                    let dice1NewData = [];
                    let dice1NewRolls = [];

                    let bias = 0;

                    for (let i = 0; i < newLabels.length; i++) {
                        if (this.myChart.data.datasets[0].labels.indexOf(newLabels[i]) != -1) {
                            dice1NewData.push(this.myChart.data.datasets[0].data[i - bias]);
                            dice1NewRolls.push(this.myChart.data.datasets[0].rolls[i - bias]);
                        }
                        else {
                            dice1NewData.push(0);
                            dice1NewRolls.push(0);
                            bias++;
                        }
                    }
                    this.myChart.data.datasets[0].rolls = dice1NewRolls;
                    this.myChart.data.datasets[0].labels = newLabels;
                    this.myChart.data.datasets[0].data = dice1NewData;
                    this.myChart.data.datasets[0].backgroundColor = newColor;
                    this.myChart.data.datasets[0].borderColor = newBorderColor;
                }

                this.myChart.data.datasets[datasetIndex].rolls = newRolls;
                this.myChart.data.labels = newLabels;
                this.myChart.data.datasets[datasetIndex].labels = newLabels;
                this.myChart.data.datasets[datasetIndex].data = newData;
                this.myChart.data.datasets[datasetIndex].backgroundColor = newColor;
                this.myChart.data.datasets[datasetIndex].borderColor = newBorderColor;

                this.updateChart(datasetIndex);  
                    
            },
            rollDice1() {
                let dice1 = this.$refs.dice1;

                if (dice1.warningRolls | dice1.warningSites) {
                    this.displayChart([], 0, 0);
                    return;
                }
                dice1.rollDice();
                
                if (this.secondDice) {
                    let dice2 = this.$refs.dice2;
                    this.displayChart(dice1.rolls, dice1.numberOfRolls, dice1.diceSidesInfo, dice2.diceSidesInfo, 0);
                }
                else {
                    this.displayChart(dice1.rolls, dice1.numberOfRolls, dice1.diceSidesInfo, [], 0);
                }
            },

            rollDice2(){
                let dice2 = this.$refs.dice2;

                if (dice2.warningRolls | dice2.warningSites) {
                    this.displayChart([], 0, 1);
                    return;
                }
                dice2.rollDice();

            
                let dice1 = this.$refs.dice1;
                this.displayChart(dice2.rolls, dice2.numberOfRolls, dice2.diceSidesInfo, dice1.diceSidesInfo, 1);
                
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
  
  
  
  