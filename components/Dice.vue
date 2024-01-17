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

        <div ref="container" class="space-y-4 lableContainer">
            <div>
                <label class="text-lg font-medium redInput w-full block">Rote Seiten: {{ 7 }}</label>
            </div>
            <div>
                <label class="text-lg font-medium greenInput w-full block">Grüne Seiten: {{ 5 }}</label>
            </div>
            <div>
                <label class="text-lg font-medium yellowInput w-full block">Gelbe Seiten: {{ 5 }}</label>
            </div>
            <div>
                <label class="text-lg font-medium blueInput w-full block">Blaue Seiten: {{ 3 }}</label>
            </div>

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
