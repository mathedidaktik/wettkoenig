<template>
    <div class="flex flex-col space-y-8">
        <select ref="diceSelect" id="diceChooser" :onChange="setDiceSides" class="border-gray-300 border rounded-md px-3 py-2 w-full" v-if="!useDiyDice">
            <option value="nodice">Würfel wählen</option>
            <option value="dice1">Weißer 10er Würfel</option>
            <option value="dice2">Schwarzer 20er Würfel</option>
        </select>

        <div class="flex flex-col items-start">
            <label for="num-rolls" class="text-lg font-medium">Anzahl Würfe:</label>
            <input type="number" id="num-rolls" class="border-gray-300 border rounded-md px-3 py-2 w-full" min="1" max="1000000" v-bind:keyup=enforceMinMax() v-model="numberOfRolls">
            <label v-if="warningRolls" class="text-red-700">Es Muss mindestens einen Wurf und maximal 1000000 Würfe geben.</label>
        </div>


        <div ref="container" class="space-y-4 lableContainer">
            <div v-if="!useDiyDice">
                <label for="red-sides" class="text-lg font-medium redInput w-full block">Rote Seiten: {{ getSidesByRank(0) }}</label>
            </div>

            <div v-if="!useDiyDice">
                <label for="yellow-sides" class="text-lg font-medium yellowInput w-full block">Gelbe Seiten: {{ getSidesByRank(1) }}</label>
            </div>

            <div v-if="!useDiyDice">
                <label for="blue-sides" class="text-lg font-medium blueInput w-full block">Blaue Seiten: {{ getSidesByRank(2) }}</label>
            </div>

            <DiceSides @sides-changed="setSides" @warning-sites="warningSitesChange" v-if="useDiyDice" v-for="index in sidesInputsCount" :text="this.diceSidesInfo[index - 1]['text']" :classColor="this.diceSidesInfo[index - 1]['classColor']"></DiceSides>

            <button id="more-colors" @click="AdjustColorCount('more')" class="button text-white rounded-md px-4 py-2" v-if="useDiyDice && sidesInputsCount < 8">Mehr Farben</button>
            <button id="less-colors" @click="AdjustColorCount('less')" class="button text-white rounded-md px-4 py-2" v-if="useDiyDice && sidesInputsCount >= 4">Weniger Farben</button>

        </div>
        <button @click="changeDiceMode" class="button text-white rounded-md px-4 py-2" v-if="!useDiyDice">Baue deinen eigenen Würfel</button>
        <button @click="changeDiceMode" class="button text-white rounded-md px-4 py-2" v-if="useDiyDice">Nutze fertige Würfel</button>
    </div>
</template>


<script>
    import {defineComponent, createApp} from 'vue'
    import DiceSides from './DiceSides.vue';
    export default {
        

    data() {
        return {
        numberOfRolls: 0,
        totalSides: 0,
        rolls: [],
        useDiyDice: false,
        warningRolls: false,
        warningSites: false,
        selectedOption:'',
        sidesInputsCount: 3,
        diceSidesInfo:  [
            {rank: 0, color:'red', text: 'Rote Seiten: ', classColor: 'redInput' , sides: 0},
            {rank: 1, color:'yellow', text: 'Gelbe Seiten: ', classColor: 'yellowInput' , sides: 0},
            {rank: 2, color:'blue', text: 'Blaue Seiten: ', classColor: 'blueInput' , sides: 0},
            {rank: 3, color:'lightblue', text: 'Hellblaue Seiten: ', classColor: 'lightblueInput' , sides: 0},
            {rank: 4, color:'green', text: 'Grüne Seiten: ', classColor: 'greenInput' , sides: 0},
            {rank: 5, color:'orange', text: 'Orange Seiten: ', classColor: 'orangeInput' , sides: 0},
            {rank: 6, color:'pink', text: 'Pinke Seiten: ', classColor: 'pinkInput' , sides: 0},
            {rank: 7, color:'black', text: 'Schwarze Seiten: ', classColor: 'blackInput' , sides: 0},
        ]
        }
    },
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    methods: {
        setSides(text, sides) {
            const diceInfo = this.diceSidesInfo.find((info) => info.text === text);
            if(diceInfo) {
                diceInfo.sides = sides;
            }
        },
        getSidesByRank(rank) {
            const diceInfo = this.diceSidesInfo.find((info) => info.rank === rank);
            return diceInfo ? diceInfo.sides : null;
        },
        setSidesByColor(color, value) {
            const diceInfo = this.diceSidesInfo.find((info) => info.color === color);
            if(diceInfo) {
                diceInfo.sides = value;
            }
        },
        setSidesByRank(rank, value) {
            const diceInfo = this.diceSidesInfo.find((info) => info.rank === rank);
            if(diceInfo) {
                diceInfo.sides = value;
            }
        },
        getSidesInRange(start, end) {
            let sidesSum = 0;
            for(let i = start; i <= end - start; i++) {
                let diceInfo = this.diceSidesInfo.find((info) => info.rank === i);
                sidesSum += diceInfo ? diceInfo.sides : 0;
            }
            
            return sidesSum;
        },
        AdjustColorCount(value) {
            if (value == "more" && this.sidesInputsCount < 8) {
                this.sidesInputsCount++;
            }
            else if (value == "less" && this.sidesInputsCount > 3){
                this.sidesInputsCount--;
                this.setSidesByRank(this.sidesInputsCount, 0)
            }

        },
        enforceMinMax() {
            if (this.numberOfRolls < 0 | this.numberOfRolls > 1000000) {
                this.warningRolls = true;
            } 
            else {
                this.warningRolls = false;
            }
        },
        warningSitesChange(sides) {
            if(sides > 1000) {
                this.warningSites = true;
            }
            else {
                this.warningSites = false;
            }
        },
        rollDice() {
            const rolls = [];

            if (this.warningRolls |this.warningSites) {
                this.rolls = rolls;
                return;
            }

            this.totalSides = 0;

            for(let i = 0; i <= this.sidesInputsCount; i++) {
                this.totalSides += this.getSidesByRank(i);
            }

            if (this.totalSides <= 0) {
                this.rolls = rolls;
                return;
            }

            let rangeRed = this.getSidesByRank(0);
            let rangeYellow = this.getSidesInRange(0, 1);
            let rangeBlue = this.getSidesInRange(0, 2);
            let rangeLightblue = this.getSidesInRange(0, 3);
            let rangeGreen = this.getSidesInRange(0, 4);
            let rangeOrange = this.getSidesInRange(0, 5);
            let rangePink = this.getSidesInRange(0, 6);

            for (let i = 0; i < this.numberOfRolls; i++) {
                const randomRoll = Math.floor(Math.random() * this.totalSides) + 1
                if (randomRoll <= rangeRed) {
                    rolls.push('red')
                } else if (randomRoll <= rangeYellow) {
                    rolls.push('yellow')
                } else if (randomRoll <= rangeBlue){
                    rolls.push('blue')
                } else if (randomRoll <= rangeLightblue) {
                    rolls.push('lightblue')
                } else if (randomRoll <= rangeGreen){
                    rolls.push('green')
                } else if (randomRoll <= rangeOrange) {
                    rolls.push('orange')
                } else if (randomRoll <= rangePink){
                    rolls.push('pink')
                } else {
                    rolls.push('black')
                } 
                
            }
            this.rolls = rolls
        },
        changeDiceMode() {
            this.useDiyDice = !this.useDiyDice;

            this.setSidesByColor('red', 0);
            this.setSidesByColor('yellow', 0);
            this.setSidesByColor('blue', 0);

            this.setSidesByColor('lightblue', 0);
            this.setSidesByColor('green', 0);
            this.setSidesByColor('orange', 0);
            this.setSidesByColor('pink', 0);
            this.setSidesByColor('black', 0);

            //if(!this.useDiyDice) sidesindex = 3
            this.$emit('dice-changed', this.id);

        },
        setDiceSides() {
            var dice = this.$refs.diceSelect.value;

            switch(dice) {
                case 'nodice':
                    this.setSidesByColor('red', 0);
                    this.setSidesByColor('yellow', 0);
                    this.setSidesByColor('blue', 0);
                    this.$emit('dice-changed', this.id);
                    break;
                case 'dice1':
                    this.setSidesByColor('red', 5);
                    this.setSidesByColor('yellow', 3);
                    this.setSidesByColor('blue', 2);
                    this.$emit('dice-changed', this.id);
                    break;
                case 'dice2':
                    this.setSidesByColor('red', 5);
                    this.setSidesByColor('yellow', 10);
                    this.setSidesByColor('blue', 5);
                    this.$emit('dice-changed', this.id);
                    break;
                default:
                    this.$emit('dice-changed', this.id);
            }

        },
        

    }
}
</script>
