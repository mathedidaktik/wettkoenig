<template>

    <div id="x-top-level-container" class="flex h-full w-full flex-wrap flex-row justify-between">
        <div>
            <div class="header-container flex w-full">
                <div class="buttons-container flex flex-row rounded-md px-4 p-4 m-0 mt-2 ml-4 mr-2">
                    <button class="button-top" :class="[backgroundColor, this.easy ? 'button-on' : '',]" @click="clickEasy">Wettkönig</button>
<!--
                    <button class="button-top" :class="[backgroundColor, this.total ? 'button-on' : '',]" @click="clickTotal">absolut</button>
                    <button class="button-top" :class="[backgroundColor, this.percent ? 'button-on' : '',]" @click="clickPercent">prozentual</button>
-->
                </div>
            </div>
            <div id="y-dice-control-container" class="dice marg">
                <Dice :default="modeData" ref="dice" @rollDice="rollDice"></Dice>
            </div>
            <p style="margin-top:50px;margin-left:10px;">Mit diesem Würfel wird gewürfelt.</p>
            <iframe src="https://vmits0710.vm.ruhr-uni-bochum.de/projekte/ikosaeder/" style="width:300px;height:300px;margin-left:100px;"></iframe>
        </div>

        
        <div id="canvas-container" class="canvas-table-container">
            <div class="table-container">

                <table class="dice-table">
                    <thead>
                        <tr class="table-row-header">
                            <th class="no-border th-fixed-w-99"></th>
                            <th class="th-fixed-w"><img class="table-head-img" src="../assets/bilder/rot.png" width="80"></th>
                            <th class="th-fixed-w"><img class="table-head-img" src="../assets/bilder/gruen.png" width="80"></th>
                            <th class="th-fixed-w"><img class="table-head-img" src="../assets/bilder/gelb.png" width="80"></th>
                            <th class="th-fixed-w"><img class="table-head-img" src="../assets/bilder/blau.png" width="80"></th>
                        </tr>
                        <tr class="table-rows">
                            <th class="no-border align-left">Tiere</th>
                            <th class="ameise">Ameise</th>
                            <th class="frosch">Frosch</th>
                            <th class="schnecke">Schnecke</th>
                            <th class="igel">Igel</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in diceResults" :key="index" class="table-rows">
                            <td class="no-border">{{ row.text}}</td>
                            <td class="ameise center">{{ row.ameise }}</td>
                            <td class="frosch center">{{ row.frosch }}</td>
                            <td class="schnecke center">{{ row.schnecke }}</td>
                            <td class="igel center">{{ row.igel }}</td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
            <div class="flex flex-col space-y-8">
                <button id="total-button" type="button" @click="resetTable" class="button text-white rounded-md px-4 py-2 mt-4 mb-2">Bei 0 beginnen</button>
            </div>
            <figure class="">
                <canvas ref="myChart" class="w-full h-full mt-1 chart" :style="{ marginLeft: marginLeft }"></canvas>
            </figure>
            <div class="img-container">
                <img class="img-chart" src="../assets/bilder/rot.png" width="100">
                <img class="img-chart" src="../assets/bilder/gruen.png" width="100">
                <img class="img-chart" src="../assets/bilder/gelb.png" width="100">
                <img class="img-chart" src="../assets/bilder/blau.png" width="100">
            </div>
        </div>
    </div>
</template>
  
<script>
    
    import { Ticks } from 'chart.js';
    import { Chart } from 'chart.js/auto';
    import { Bundle } from 'magic-string';
    import lodash from "lodash";
    import { Mode } from '../assets/enum/mode.js';
    import rotBild from '../assets/bilder/rot.png';
    import gruenBild from '../assets/bilder/gruen.png';
    import gelbBild from '../assets/bilder/gelb.png';
    import blauBild from '../assets/bilder/blau.png';


export default{
        data() {
            return {
                easy: false,
                total: false,
                percent: false,
                modeData: Mode.NONE,
                numberOfRollsTotal: 0,
                chartHorizontal: true,
                chart: null,
                marginLeft: '52px',
                diceDataTotal: [0, 0, 0, 0],
                diceResults: [
                    { text: 'Stand', ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                    { text: 'absolut', ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                    { text: 'prozentual', ameise: 0, frosch: 0, schnecke: 0, igel: 0 }
                ],
                chartData: {
                    labels: ['', '', '', ''],
                    datasets: [
                    {
                        labels: ['rot', 'grün', 'gelb', 'blau'],
                        backgroundColor: ['rgba(211, 61, 46, 1)', 'rgba(165, 188, 67, 1)', 'rgba(238, 228, 106, 1)', 'rgba(117, 188, 209, 1)'],
                        borderColor: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0,0,0)', 'rgb(0, 0, 0)'],
                        borderWidth: 1,
                        data: [0, 0, 0, 0],
                        percent: [0, 0, 0, 0],
                        rolls: [0, 0, 0, 0],
                        images: [rotBild, gruenBild, gelbBild, blauBild],
                        categoryPercentage: 1.0,
                        barPercentage: 1.0
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
                                label: (context) => {  
                                    var color = context.dataset.backgroundColor[context.dataIndex];
                                    var value = context.dataset.data[context.dataIndex];

                                    if(this.percent) {
                                        value = value + "%";
                                    }

                                    var colorname = "";
                                    switch(context.dataIndex){
                                        case 0:
                                            colorname = "rot";
                                            break;
                                        case 1:
                                            colorname = "grün";
                                            break;
                                        case 2:
                                            colorname = "gelb";
                                            break;
                                        case 3:
                                            colorname = "blau";
                                            break;
                                    }
                                    return colorname + ': ' + value;
                                },
                            },
                            },
                        legend: {
                            display:false
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
                document.getElementById("y-dice-control-container").style.visibility = "visible";
                document.getElementById("canvas-container").style.visibility = "visible";
                document.getElementById("total-button").style.visibility = "hidden";

                this.modeData = Mode.EASY;
                this.easy = true;
                this.total = false;
                this.percent = false;
                this.diceResults = [{ text: 'Stand', ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
                this.diceDataTotal = [0, 0, 0, 0];
                
                this.myChart.options.scales.y.max = 100;
                this.myChart.options.scales.y.min = 0;

                this.myChart.options.scales.y.ticks.stepSize = undefined;
                this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + "    ";
                };         

                this.myChart.options.animation.duration = 0;
                this.resetTable();
                this.myChart.options.animation.duration = 1500;
            },
            clickTotal() {
                document.getElementById("y-dice-control-container").style.visibility = "visible";
                document.getElementById("canvas-container").style.visibility = "visible";
                document.getElementById("total-button").style.visibility = "visible";

                this.modeData = Mode.TOTAL;
                this.easy = false;
                this.total = true;
                this.percent = false;
                this.diceResults = [{ text: 'Stand', ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { text: 'absolut', ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
                this.numberOfRollsTotal = 0;
                this.diceDataTotal = [0, 0, 0, 0];


                this.myChart.options.scales.y.max = 100;
                this.myChart.options.scales.y.min = 0;

                this.myChart.options.scales.y.ticks.stepSize = undefined;
                this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + "    ";
                };

                this.myChart.options.animation.duration = 0;
                this.resetTable();
                this.myChart.options.animation.duration = 1500;
            },
            clickPercent() {
                document.getElementById("y-dice-control-container").style.visibility = "visible";
                document.getElementById("canvas-container").style.visibility = "visible";
                document.getElementById("total-button").style.visibility = "visible";

                this.modeData = Mode.PERCENT;
                this.easy = false;
                this.total = false;
                this.percent = true;
                this.diceResults = [{ text: 'Stand', ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { text: 'absolut', ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { text: 'prozentual', ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
                this.numberOfRollsTotal = 0;
                this.diceDataTotal = [0, 0, 0, 0];


                this.myChart.options.scales.y.max = 100;
                this.myChart.options.scales.y.min = 0;

                this.myChart.options.scales.y.ticks.stepSize = undefined;
                this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + '%';
                };
                
                this.myChart.options.animation.duration = 0;
                this.resetTable();
                this.myChart.options.animation.duration = 1500;
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

                if(this.easy) {
                    this.myChart.options.animation.duration = 0;
                    this.setTableToZero();
                    this.myChart.options.animation.duration = 1500;
                }

                var allData = [
                {rank: 1, label: 'Rot', value: ((rolls.filter(roll => roll === 'red').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'red').length), sides: 7},
                {rank: 2, label: 'Grün', value: ((rolls.filter(roll => roll === 'green').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'green').length), sides: 5},
                {rank: 3, label: 'Gelb', value: ((rolls.filter(roll => roll === 'yellow').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'yellow').length), sides: 5},
                {rank: 4, label: 'Blau', value: ((rolls.filter(roll => roll === 'blue').length) / numberOfRolls) * 100, rolls: (rolls.filter(roll => roll === 'blue').length), sides: 3},
                ]
            
                if (this.percent){
                    var newData = [((this.diceResults[1].ameise/ this.numberOfRollsTotal) * 100).toFixed(2), ((this.diceResults[1].frosch/ this.numberOfRollsTotal) * 100).toFixed(2), ((this.diceResults[1].schnecke/ this.numberOfRollsTotal) * 100).toFixed(2), ((this.diceResults[1].igel/ this.numberOfRollsTotal) * 100).toFixed(2)];
                } 
                else if (this.easy) {
                    var newData = allData.map(data => data.rolls);
                }
                else {
                    var newData = [this.diceResults[1].ameise, this.diceResults[1].frosch, this.diceResults[1].schnecke, this.diceResults[1].igel];
                }

                var newRolls = allData.map(data => data.rolls);

                this.myChart.data.datasets[0].rolls = newRolls;
                this.myChart.data.datasets[0].data = newData;
                this.myChart.data.datasets[0].percent = allData.map(data => data.value);

                if (this.easy) {
                    this.fixLables(numberOfRolls);
                    this.fixCallback(numberOfRolls);

                }
                if (this.total) {
                    this.fixLables(this.numberOfRollsTotal);
                    this.fixCallback(this.numberOfRollsTotal);

                }
                if (this.percent) {
                    this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + "%";
                    }  
                    this.myChart.options.scales.y.ticks.stepSize = undefined;
                }
                
                this.myChart.update();
              
            },
            rollDice() {
                let dice = this.$refs.dice;

                if (dice.warningRolls || dice.warningSites) {
                    
                    this.displayChart([], 0);
                    return;
                }

            
                this.numberOfRollsTotal = this.numberOfRollsTotal + dice.numberOfRolls;

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
                    this.diceResults[2].ameise =  ((this.diceResults[1].ameise / this.numberOfRollsTotal) * 100).toFixed(2).replace('.', ',') + "%";
                    this.diceResults[2].frosch = ((this.diceResults[1].frosch / this.numberOfRollsTotal) * 100).toFixed(2).replace('.', ',') + "%";
                    this.diceResults[2].schnecke = ((this.diceResults[1].schnecke/ this.numberOfRollsTotal) * 100).toFixed(2).replace('.', ',') + "%";
                    this.diceResults[2].igel = ((this.diceResults[1].igel/ this.numberOfRollsTotal) * 100).toFixed(2).replace('.', ',') + "%";
                }


                this.displayChart(dice.rolls, dice.numberOfRolls);
            },
            resetTable() {
                this.diceResults[0].ameise =  0;
                this.diceResults[0].frosch = 0;
                this.diceResults[0].schnecke = 0;
                this.diceResults[0].igel = 0;

                if (this.total || this.percent) {
                    this.diceResults[1].ameise =  0;
                    this.diceResults[1].frosch = 0;
                    this.diceResults[1].schnecke = 0;
                    this.diceResults[1].igel = 0;
                }

                if (this.percent) {
                    this.diceResults[2].ameise =  0;
                    this.diceResults[2].frosch = 0;
                    this.diceResults[2].schnecke = 0;
                    this.diceResults[2].igel = 0;
                }

                this.numberOfRollsTotal = 0;
                this.diceDataTotal = [0, 0, 0, 0];

                this.$refs.dice.setTotalRollsZero();
                this.setTableToZero();

                if (this.total) {
                    this.myChart.options.scales.y.ticks.stepSize = 10;
                    this.myChart.options.scales.y.max = 100;
                }
                this.myChart.update();

            },
            fixLables(number){
                if (number < 6){
                    this.myChart.options.scales.y.ticks.stepSize = 1;
                    this.myChart.options.scales.y.max = 5;
                }
                else if (number < 11){
                    this.myChart.options.scales.y.ticks.stepSize = 2;
                    this.myChart.options.scales.y.max = 10;
                }
                else if (number < 50){
                    this.myChart.options.scales.y.ticks.stepSize = 5;
                    if ((Math.floor(number / 10) * 10) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 10) * 10);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 10) * 10) + 10;

                    }
                }
                else if (number == 50){
                    this.myChart.options.scales.y.ticks.stepSize = 5;
                    this.myChart.options.scales.y.max = 50;
                }
                else if (number < 100){
                    this.myChart.options.scales.y.ticks.stepSize = 10;
                    if ((Math.floor(number / 10) * 10) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 10) * 10);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 10) * 10) + 10;

                    }
                }
                else if (number == 100){
                    this.myChart.options.scales.y.ticks.stepSize = 10;
                    this.myChart.options.scales.y.max = 100;
                }
                else if (number < 200){
                    this.myChart.options.scales.y.ticks.stepSize = 20;
                    if ((Math.floor(number / 20) * 20) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 20) * 20);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 20) * 20) + 20;

                    }
                }
                else if (number == 200){
                    this.myChart.options.scales.y.ticks.stepSize = 20;
                    this.myChart.options.scales.y.max = 200;
                }
                else if (number < 500){
                    this.myChart.options.scales.y.ticks.stepSize = 50;
                    if ((Math.floor(number / 50) * 50) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 50) * 50);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 50) * 50) + 50;

                    }
                }
                else if (number == 500){
                    this.myChart.options.scales.y.ticks.stepSize = 50;
                    this.myChart.options.scales.y.max = 500;
                }
                else if (number < 1000){
                    this.myChart.options.scales.y.ticks.stepSize = 100;
                    if ((Math.floor(number / 100) * 100) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 100) * 100);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 100) * 100) + 100;

                    }
                }
                else if (number == 1000){
                    this.myChart.options.scales.y.ticks.stepSize = 100;
                    this.myChart.options.scales.y.max = 1000;
                }
                else if (number < 2000){
                    this.myChart.options.scales.y.ticks.stepSize = 200;
                    if ((Math.floor(number / 200) * 200) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 200) * 200);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 200) * 200) + 200;

                    }
                }
                else if (number == 2000){
                    this.myChart.options.scales.y.ticks.stepSize = 200;
                    this.myChart.options.scales.y.max = 2000;
                }
                else if (number < 5000){
                    this.myChart.options.scales.y.ticks.stepSize = 500;
                    if ((Math.floor(number / 500) * 500) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 500) * 500);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 500) * 500) + 500;

                    }
                }
                else if (number == 5000){
                    this.myChart.options.scales.y.ticks.stepSize = 500;
                    this.myChart.options.scales.y.max = 5000;
                }
                else if (number < 10000){
                    this.myChart.options.scales.y.ticks.stepSize = 1000;
                    if ((Math.floor(number / 1000) * 1000) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 1000) * 1000);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 1000) * 1000) + 1000;

                    }
                }
                else if (number == 10000){
                    this.myChart.options.scales.y.ticks.stepSize = 1000;
                    this.myChart.options.scales.y.max = 10000;
                }
                else if (number < 20000){
                    this.myChart.options.scales.y.ticks.stepSize = 2000;
                    if ((Math.floor(number / 2000) * 2000) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 2000) * 2000);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 2000) * 2000) + 2000;

                    }
                }
                else if (number == 20000){
                    this.myChart.options.scales.y.ticks.stepSize = 2000;
                    this.myChart.options.scales.y.max = 20000;
                }
                else if (number < 50000){
                    this.myChart.options.scales.y.ticks.stepSize = 5000;
                    if ((Math.floor(number / 5000) * 5000) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 5000) * 5000);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 5000) * 5000) + 5000;

                    }
                }
                else if (number == 50000){
                    this.myChart.options.scales.y.ticks.stepSize = 5000;
                    this.myChart.options.scales.y.max = 50000;
                }
                else if (number < 100000){
                    this.myChart.options.scales.y.ticks.stepSize = 10000;
                    if ((Math.floor(number / 10000) * 10000) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 10000) * 10000);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 10000) * 10000) + 10000;

                    }
                }
                else if (number == 100000){
                    this.myChart.options.scales.y.ticks.stepSize = 10000;
                    this.myChart.options.scales.y.max = 100000;
                }
                else if (number < 200000){
                    this.myChart.options.scales.y.ticks.stepSize = 20000;
                    if ((Math.floor(number / 20000) * 20000) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 20000) * 20000);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 20000) * 20000) + 20000;

                    }
                }
                else if (number == 200000){
                    this.myChart.options.scales.y.ticks.stepSize = 20000;
                    this.myChart.options.scales.y.max = 200000;
                }
                else if (number < 500000){
                    this.myChart.options.scales.y.ticks.stepSize = 50000;
                    if ((Math.floor(number / 50000) * 50000) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 50000) * 50000);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 50000) * 50000) + 50000;

                    }
                }
                else if (number == 500000){
                    this.myChart.options.scales.y.ticks.stepSize = 50000;
                    this.myChart.options.scales.y.max = 500000;
                }
                else if (number < 1000000){
                    this.myChart.options.scales.y.ticks.stepSize = 100000;
                    if ((Math.floor(number / 100000) * 100000) == number){
                        this.myChart.options.scales.y.max =  (Math.floor(number / 100000) * 100000);

                    }
                    else {
                        this.myChart.options.scales.y.max =  (Math.floor(number / 100000) * 100000) + 100000;

                    }
                }

                else {
                    this.myChart.options.scales.y.ticks.stepSize = undefined;
                }
            },
            fixMargin(number){
                console.log("margin start");

                if (number < 100) {
                    this.marginLeft = "50px";
                    console.log(this.marginLeft + "1");
                } else if (number < 10000) {
                    this.marginLeft = "35px";
                    console.log(this.marginLeft + "2");
                } else if (number < 10000000) {
                    this.marginLeft = "30px";
                    console.log(this.marginLeft + "3");
                }
            },
            fixCallback(number) {
                if (number < 100) {
                    this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + "     ";
                    }                
                } else if (number < 1000) {
                    this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + "    ";
                    }  
                } else if (number < 10000) {
                    this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + "   ";
                    }  
                } else if (number < 100000) {
                    this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + "  ";
                    }  
                } else if (number < 1000000) {
                    this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value + " ";
                    }  
                } else if (number < 10000000) {
                    this.myChart.options.scales.y.ticks.callback = function(value, index, ticks) {
                    return value;
                    }  
                }
            }
        },
        mounted() {
            let ctx = this.$refs.myChart.getContext('2d');
            this.myChart = new Chart(ctx, {
                type: 'bar',
                data: this.chartData,
                options: this.chartOptions,
            });

            document.getElementById("y-dice-control-container").style.visibility = "hidden";
            document.getElementById("canvas-container").style.visibility = "hidden";
            
            this.clickEasy();
        }

       
    }
</script>
  
  
  
  
