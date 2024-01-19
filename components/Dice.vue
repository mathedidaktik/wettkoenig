<template>
    <div class="flex flex-col space-y-8">

        <div class="flex flex-col items-start">
            <label for="num-rolls" class="text-lg font-medium">Anzahl Würfe:</label>
            <input type="number" id="num-rolls" class="border-gray-300 border rounded-md px-3 py-2 w-full" min="1" max="1000000" v-bind:keyup=enforceMinMax() v-model="numberOfRolls">
            <label v-if="warningRolls" class="text-red-700">Es Muss mindestens einen Wurf und maximal 1000000 Würfe geben.</label>
        </div>

        <div class="flex flex-col space-y-8">
            <button type="button" @click="diceRolled" class="button text-white rounded-md px-4 py-2 mt-4 mb-2">Würfeln</button>
        </div>

        <div ref="container" class="space-y-2 lableContainer">
            <label>Auf dem Würfel sind:</label>
            <div>
                <label class="text-lg font-medium redInput w-full block">{{ 7 }} Rote Seiten</label>
            </div>
            <div>
                <label class="text-lg font-medium greenInput w-full block">{{ 5 }} Grüne Seiten</label>
            </div>
            <div>
                <label class="text-lg font-medium yellowInput w-full block">{{ 5 }} Gelbe Seiten</label>
            </div>
            <div>
                <label class="text-lg font-medium blueInput w-full block">{{ 3 }} Blaue Seiten</label>
            </div>
        </div>
        <div class="table-container">
            <div class="row-descriptions">
                <div>Tiere</div>
                <div>Stand</div>
                <div>Absolut</div>
            </div>
            <table class="dice-table">
                <thead>
                    <tr>
                        <th class="ameise">Ameise</th>
                        <th class="frosch">Frosch</th>
                        <th class="schnecke">Schnecke</th>
                        <th class="igel">Igel</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in diceResults" :key="index">
                        <td>{{ row.ameise }}</td>
                        <td>{{ row.frosch }}</td>
                        <td>{{ row.schnecke }}</td>
                        <td>{{ row.igel }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script>
    import {defineComponent, createApp} from 'vue'
    export default {
        

    data() {
        return {
        numberOfRolls: 0,
        totalSides: 20,
        rolls: [],
        warningRolls: false,
        warningSites: false,
        diceSidesInfo:  [
            {rank: 0, color:'red', text: 'Rote Seiten: ', classColor: 'redInput' , sides: 7},
            {rank: 1, color:'green', text: 'Grüne Seiten: ', classColor: 'greenInput' , sides: 5},
            {rank: 2, color:'yellow', text: 'Gelbe Seiten: ', classColor: 'yellowInput' , sides: 5},
            {rank: 3, color:'blue', text: 'Blaue Seiten: ', classColor: 'blueInput' , sides: 3},
        ],
        diceResults: [
            { ameise: 0, frosch: 0, schnecke: 0, igel: 0 },
            { ameise: 0, frosch: 0, schnecke: 0, igel: 0 }
        ]
        }
    },
    methods: {
        diceRolled() {
            const rolls = [];

            if (this.warningRolls || this.warningSites) {
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

            this.diceResults[1].ameise =  this.diceResults[1].ameise + (rolls.filter(roll => roll === 'red').length);
            this.diceResults[1].frosch = this.diceResults[1].frosch + (rolls.filter(roll => roll === 'green').length);
            this.diceResults[1].schnecke = this.diceResults[1].schnecke + (rolls.filter(roll => roll === 'yellow').length);
            this.diceResults[1].igel = this.diceResults[1].igel  + (rolls.filter(roll => roll === 'blue').length);
 

            this.$emit('rollDice');
        },
        enforceMinMax() {
            
            if (this.numberOfRolls < 0 | this.numberOfRolls > 1000000 | !this.numberOfRolls & this.numberOfRolls != "0") {
                this.warningRolls = true;
            } 
            else {
                this.warningRolls = false;
            }
        },
        warningSitesChange(sides) {
            if(sides < 0 | sides > 1000 | !sides & sides != "0") {
                this.warningSites = true;
            }
            else {
                this.warningSites = false;
            }
        },
    }
}
</script>
