<template>
    <div class="header-container flex w-full">
        <div class="buttons-container flex flex-row rounded-md px-4 p-4 m-0 mt-2 ml-4 mr-2">
            <button class="button-top" @click="clickEasy">Einfach</button>
            <button class="button-top" @click="clickTotal">Absolut</button>
            <button class="button-top" @click="clickPercent">Prozent</button>
        </div>
    </div>

    <div id="x-top-level-container" class="flex h-full w-full flex-wrap flex-row justify-between">
        
        <div id="y-dice-control-container" class="dice p-4 h-full">
            <Dice :default="modeData" ref="dice" @rollDice="rollDice"></Dice>
        </div>
        
        <div id="canvas-container" class="canvas-table-container">
            <div class="table-container">
                <div class="row-descriptions">
                    <div>Tiere</div>
                    <div>Stand</div>
                    <div v-if="this.total || this.percent">Absolut</div>
                    <div v-if="this.percent">Prozent</div>
                </div>
                <div>
                    <table class="dice-table">
                        <thead>
                            <tr>
                                <th><img class="table-head-img" src="../assets/bilder/rot.png" width="100"></th>
                                <th><img class="table-head-img" src="../assets/bilder/grün.png" width="100"></th>
                                <th><img class="table-head-img" src="../assets/bilder/gelb.png" width="100"></th>
                                <th><img class="table-head-img" src="../assets/bilder/blau.png" width="100"></th>
                            </tr>
                            <tr>
                                <th class="ameise">Ameise</th>
                                <th class="frosch">Frosch</th>
                                <th class="schnecke">Schnecke</th>
                                <th class="igel">Igel</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in diceResults" :key="index">
                                <td class="ameise">{{ row.ameise }}</td>
                                <td class="frosch">{{ row.frosch }}</td>
                                <td class="schnecke">{{ row.schnecke }}</td>
                                <td class="igel">{{ row.igel }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <label v-if="this.total||this.percent" class="rolls">Anzahl Würfe Insgesamt: {{ this.numberOfRollsTotal }}</label>
            </div>
            <div class="flex flex-col space-y-8">
                <button v-if="this.total||this.percent" type="button" @click="resetTotal" class="button text-white rounded-md px-4 py-2 mt-4 mb-2">Absolut zurücksetzen</button>
            </div>
            <figure>
                <canvas ref="myChart" class="w-full h-full mt-1 chart"></canvas>
            </figure>
        </div>
    </div>
</template>
  
<script>
    
    import { Ticks } from 'chart.js';
    import { Chart } from 'chart.js/auto';
    import { Bundle } from 'magic-string';
    import lodash from "lodash";
    import { Mode } from '../assets/enum/mode.js';

  
export default{
        data() {
            return {
                easy: false,
                total: false,
                percent: false,
                hasMode:false,
                modeData: Mode.NONE,
                numberOfRollsTotal: 0,
                chartHorizontal: true,
                chart: null,
                diceResults: [
                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 }
                ],
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
            clickEasy() {
                document.getElementById("x-top-level-container").style.visibility = "visible"; 
                this.modeData = Mode.EASY;
                this.easy = true;
                this.total = false;
                this.percent = false;
                this.diceResults = [{ ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
            },
            clickTotal() {
                document.getElementById("x-top-level-container").style.visibility = "visible"; 
                this.hasMode = true;
                this.modeData = Mode.TOTAL;
                this.easy = false;
                this.total = true;
                this.percent = false;
                this.diceResults = [{ ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
                this.numberOfRollsTotal = 0;
            },
            clickPercent() {
                document.getElementById("x-top-level-container").style.visibility = "visible"; 
                this.hasMode = true;
                this.modeData = Mode.PERCENT;
                this.easy = false;
                this.total = false;
                this.percent = true;
                this.diceResults = [{ ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
                this.numberOfRollsTotal = 0;
            },
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
                this.diceResults[0].ameise = (dice.rolls.filter(roll => roll === 'red').length);
                this.diceResults[0].frosch = (dice.rolls.filter(roll => roll === 'green').length);
                this.diceResults[0].schnecke = (dice.rolls.filter(roll => roll === 'yellow').length);
                this.diceResults[0].igel = (dice.rolls.filter(roll => roll === 'blue').length);

                if (this.total || this.percent) {
                    this.diceResults[1].ameise =  this.diceResults[1].ameise + (dice.rolls.filter(roll => roll === 'red').length);
                    this.diceResults[1].frosch = this.diceResults[1].frosch + (dice.rolls.filter(roll => roll === 'green').length);
                    this.diceResults[1].schnecke = this.diceResults[1].schnecke + (dice.rolls.filter(roll => roll === 'yellow').length);
                    this.diceResults[1].igel = this.diceResults[1].igel  + (dice.rolls.filter(roll => roll === 'blue').length);
                }

                if (this.percent) {
                    this.diceResults[2].ameise =  (((dice.rolls.filter(roll => roll === 'red').length) / dice.numberOfRolls) * 100).toFixed() + "%";
                    this.diceResults[2].frosch = (((dice.rolls.filter(roll => roll === 'green').length) / dice.numberOfRolls) * 100).toFixed() + "%";
                    this.diceResults[2].schnecke = (((dice.rolls.filter(roll => roll === 'yellow').length) / dice.numberOfRolls) * 100).toFixed() + "%";
                    this.diceResults[2].igel = (((dice.rolls.filter(roll => roll === 'blue').length) / dice.numberOfRolls) * 100).toFixed() + "%";
                }

                this.numberOfRollsTotal = this.numberOfRollsTotal + dice.numberOfRolls;

                this.displayChart(dice.rolls, dice.numberOfRolls);
            },
            resetTotal() {
            this.diceResults[1].ameise =  0;
            this.diceResults[1].frosch = 0;
            this.diceResults[1].schnecke = 0;
            this.diceResults[1].igel = 0;

            this.numberOfRollsTotal = 0;
        },
        },

        mounted() {
            let ctx = this.$refs.myChart.getContext('2d');
            this.myChart = new Chart(ctx, {
            type: 'bar',
            data: this.chartData,
            options: this.chartOptions
            });

            document.getElementById("x-top-level-container").style.visibility = "hidden"; 
        },
       
    }
</script>
  
  
  
  