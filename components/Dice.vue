<template>
    <div class="flex flex-col space-y-8">

        <div class="flex flex-col items-start">
            <label for="num-rolls" class="text-lg font-medium">Anzahl Würfe:</label>
            <input v-on:keyup.enter="diceRolled" type="number" id="num-rolls" class="border-gray-300 border rounded-md px-3 py-2 w-full" min="1" max="1000000" v-bind:keyup=enforceMinMax() v-model="numberOfRolls" @input="removeLeadingZeros">
            <label v-if="warningRollsLow" class="text-red-700">Du musst mindestens 1 eingeben.</label>
            <label v-if="warningRollsHigh" class="text-red-700">Du darfst maximal 1.000.000 eingeben.</label>
        </div>

        <div class="flex flex-col space-y-8">
            <button type="button" @click="diceRolled" class="button text-white rounded-md px-4 py-2 mt-4 mb-2">Würfeln</button>
        </div>

        <div v-if="this.total||this.percent" ref="container" class="space-y-2 lableContainer">
            <label>Auf dem Würfel sind:</label>
            <div>
                <label class="text-lg font-medium redInput w-full block">{{ 7 }} rote Seiten</label>
            </div>
            <div>
                <label class="text-lg font-medium greenInput w-full block">{{ 5 }} grüne Seiten</label>
            </div>
            <div>
                <label class="text-lg font-medium yellowInput w-full block">{{ 5 }} gelbe Seiten</label>
            </div>
            <div>
                <label class="text-lg font-medium blueInput w-full block">{{ 3 }} blaue Seiten</label>
            </div>
        </div>
        <div class="table-container">
            <div v-if="this.easy" class="row-descriptions">
                <div>Tiere</div>
                <div>Stand</div>
            </div>
            <div v-if="this.total" class="row-descriptions">
                <div>Tiere</div>
                <div>Stand</div>
                <div>Absolut</div>
            </div>
            <div v-if="this.percent" class="row-descriptions">
                <div>Tiere</div>
                <div>Stand</div>
                <div>Absolut</div>
                <div>Prozent</div>
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
    </div>
</template>


<script>
    import {defineComponent, createApp} from 'vue'
    import { Mode } from '../assets/enum/mode.js';
    export default {
    props: {
        default: {
            type: String,
            default: Mode.NONE, // Standardwert setzen
            validator: value => Object.values(Mode).includes(value)
        }
    },

    watch: {
        default(newVal, oldVal) {
            console.log('Modus geändert von', oldVal, 'zu', newVal);
            if(oldVal == newVal) return;
            if(newVal == Mode.EASY) {
                this.easy = true;
                this.total = false;
                this.percent = false;

                this.diceResults = [{ ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
            } 
            if(newVal == Mode.TOTAL) {
                this.total = true;
                this.easy = false;
                this.percent = false;
                this.diceResults = [{ ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
                this.numberOfRollsTotal = 0;
            } 
            if(newVal == Mode.PERCENT) {
                this.percent = true;
                this.easy = false;
                this.total = false;
                this.diceResults = [{ ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
                                    { ameise: 0, frosch: 0, schnecke: 0, igel: 0 }];
                this.numberOfRollsTotal = 0;
            } 
        }
    },

    data() {
        return {
        easy: false,
        total: false,
        percent: false,
        numberOfRolls: '',
        numberOfRollsTotal: 0,
        totalSides: 20,
        rolls: [],
        warningRollsHigh: false,
        warningRollsLow: false,
        diceSidesInfo:  [
            {rank: 0, color:'red', text: 'Rote Seiten: ', classColor: 'redInput' , sides: 7},
            {rank: 1, color:'green', text: 'Grüne Seiten: ', classColor: 'greenInput' , sides: 5},
            {rank: 2, color:'yellow', text: 'Gelbe Seiten: ', classColor: 'yellowInput' , sides: 5},
            {rank: 3, color:'blue', text: 'Blaue Seiten: ', classColor: 'blueInput' , sides: 3},
        ],
        diceResults: [
            { ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
            { ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
            { ameise: 0, frosch: 0, schnecke: 0, igel: 0 }
        ],
        }
    },
    methods: {
        diceRolled() {
            const rolls = [];

            if (this.numberOfRolls == 0) {
                this.warningRollsLow = true;
            }

            if (this.warningRollsLow || this.warningRollsHigh) {
                this.rolls = rolls;
                return;
            }

            let rangeRed = 7;
            let rangeGreen = 12;
            let rangeYellow = 17;
            let rangeBlue = 20;


            for (let i = 0; i < this.numberOfRolls; i++) {
                const randomRoll = Math.floor(Math.random() * this.totalSides) + 1
                if (randomRoll <= rangeRed) {
                    rolls.push('red')
                } else if (randomRoll <= rangeGreen) {
                    rolls.push('green')
                } else if (randomRoll <= rangeYellow){
                    rolls.push('yellow')
                } else if (randomRoll <= rangeBlue) {
                    rolls.push('blue')
                }
            }
            this.rolls = rolls

            this.diceResults[0].ameise = (rolls.filter(roll => roll === 'red').length);
            this.diceResults[0].frosch = (rolls.filter(roll => roll === 'green').length);
            this.diceResults[0].schnecke = (rolls.filter(roll => roll === 'yellow').length);
            this.diceResults[0].igel = (rolls.filter(roll => roll === 'blue').length);

            if (this.total || this.percent) {
                this.diceResults[1].ameise =  this.diceResults[1].ameise + (rolls.filter(roll => roll === 'red').length);
                this.diceResults[1].frosch = this.diceResults[1].frosch + (rolls.filter(roll => roll === 'green').length);
                this.diceResults[1].schnecke = this.diceResults[1].schnecke + (rolls.filter(roll => roll === 'yellow').length);
                this.diceResults[1].igel = this.diceResults[1].igel  + (rolls.filter(roll => roll === 'blue').length);
            }

            if (this.percent) {
                this.diceResults[2].ameise =  (((rolls.filter(roll => roll === 'red').length) / this.numberOfRolls) * 100).toFixed() + "%";
                this.diceResults[2].frosch = (((rolls.filter(roll => roll === 'green').length) / this.numberOfRolls) * 100).toFixed() + "%";
                this.diceResults[2].schnecke = (((rolls.filter(roll => roll === 'yellow').length) / this.numberOfRolls) * 100).toFixed() + "%";
                this.diceResults[2].igel = (((rolls.filter(roll => roll === 'blue').length) / this.numberOfRolls) * 100).toFixed() + "%";
            }

            this.numberOfRollsTotal = this.numberOfRollsTotal + this.numberOfRolls;

            this.$emit('rollDice');
        },
        enforceMinMax() {
            
            if (this.numberOfRolls > 1000000) {
                this.warningRollsHigh = true;
            } 
            else if(this.numberOfRolls > 0) {
                this.warningRollsHigh = false;
                this.warningRollsLow = false;
            }
        },
        resetTotal() {
            this.diceResults[1].ameise =  0;
            this.diceResults[1].frosch = 0;
            this.diceResults[1].schnecke = 0;
            this.diceResults[1].igel = 0;

            this.numberOfRollsTotal = 0;
        },
        removeLeadingZeros(event) {
            event.target.value = event.target.value.replace(/^0+/, '');
        }
    }
}
</script>
