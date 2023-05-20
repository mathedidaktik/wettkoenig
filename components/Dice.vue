<template>
    <div class="flex flex-col space-y-8">
        <button @click="changeDiceMode" class="button text-white rounded-md px-4 py-2" v-if="!useDiyDice">Baue deinen eingenen Würfel</button>
        <button @click="changeDiceMode" class="button text-white rounded-md px-4 py-2" v-if="useDiyDice">Nutze fertige Würfel</button>

        <div class="flex flex-col items-start">
            <label for="num-rolls" class="text-lg font-medium">Anzahl Würfe:</label>
            <input type="number" id="num-rolls" class="border-gray-300 border rounded-md px-3 py-2 w-full" min="1" max="1000000" v-bind:keyup=enforceMinMax() v-model="numberOfRolls">
        </div>

        <select ref="diceSelect" id="diceChooser" :onChange="setDiceSides" class="border-gray-300 border rounded-md px-3 py-2 w-full" v-if="!useDiyDice">
            <option value="nodice">Würfel wählen</option>
            <option value="dice1">Weißer 10er Würfel</option>
            <option value="dice2">Schwarzer 20er Würfel</option>
        </select>

        <div class="space-y-4 lableContainer">
            <div v-if="!useDiyDice">
                <label for="red-sides" class="text-lg font-medium redInput w-full block">Rote Seiten: {{ redSides }}</label>
            </div>
            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="red-sides" class="text-lg font-medium redInput w-full block">Rote Seiten:</label>
                <input type="number" id="red-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-model="redSides">
            </div>

            <div v-if="!useDiyDice">
                <label for="yellow-sides" class="text-lg font-medium yellowInput w-full block">Gelbe Seiten: {{ yellowSides }}</label>
            </div>
            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="yellow-sides" class="text-lg font-medium yellowInput w-full block">Gelbe Seiten:</label>
                <input type="number" id="yellow-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-model="yellowSides">
            </div>

            <div v-if="!useDiyDice">
                <label for="blue-sides" class="text-lg font-medium blueInput w-full block">Blaue Seiten: {{ blueSides }}</label>
            </div>
            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="blue-sides" class="text-lg font-medium blueInput w-full block">Blaue Seiten:</label>
                <input type="number" id="blue-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-model="blueSides">
            </div>

            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="lightblue-sides" class="text-lg font-medium lightblueInput w-full block">Hellblaue Seiten:</label>
                <input type="number" id="lightblue-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-model="lightblueSides">
            </div>

            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="green-sides" class="text-lg font-medium greenInput w-full block">Grüne Seiten:</label>
                <input type="number" id="green-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-model="greenSides">
            </div>

            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="orange-sides" class="text-lg font-medium orangeInput w-full block">Orange Seiten:</label>
                <input type="number" id="orange-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-model="orangeSides">
            </div>

            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="pink-sides" class="text-lg font-medium pinkInput w-full block">Pink Seiten:</label>
                <input type="number" id="pink-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-model="pinkSides">
            </div>

            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="black-sides" class="text-lg font-medium blackInput w-full block">Schwarze Seiten:</label>
                <input type="number" id="black-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-model="blackSides">
            </div>
        </div>
        <lable v-if="warningRolls" class="text-red-700">Es Muss mindestens einen Wurf und maximal 1000000 Würfe geben.</lable>
        <label v-if="warningSites" class="text-red-700">Die Seitenanzahl der einzelnen farben muss mindestens 0 und maximal 1000 betragen.</label>
    </div>
</template>


<script>
    
    export default {

    data() {
        return {
        numberOfRolls: 0,
        totalSides: 0,
        redSides: 0,
        yellowSides: 0,
        blueSides: 0,
        lightblueSides: 0,
        greenSides: 0,
        orangeSides: 0,
        pinkSides: 0,
        blackSides: 0,
        rolls: [],
        useDiyDice: false,
        warningRolls: false,
        warningSites: false,
        selectedOption:''
        }
    },
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    methods: {
        enforceMinMax() {
            if (this.numberOfRolls < 0 | this.numberOfRolls > 1000000) {
                this.warningRolls = true;
            } 
            else {
                this.warningRolls = false;
            }
            if (this.yellowSides < 0 | this.yellowSides > 1000 | this.blueSides < 0 | this.blueSides > 1000 | this.redSides < 0 | this.redSides > 1000 |
                this.lightblueSides < 0 | this.lightblueSides > 1000 | this.greenSides < 0 | this.greenSides > 1000 | this.orangeSides < 0 | this.orangeSides > 1000 |
                this.pinkSides < 0 | this.pinkSides > 1000 | this.blackSides < 0 | this.blackSides > 1000) {
                this.warningSites = true;
            }
            else {
                this.warningSites = false;
            }
        },
        rollDice() {
            const rolls = [];
            if (this.warningRolles |this.warningSites) {
                this.rolls = rolls;
            }

            this.totalSides = this.redSides + this.yellowSides + this.blueSides + this.lightblueSides + this.greenSides + this.orangeSides + this.pinkSides + this.blackSides;

            if (this.totalSides <= 0) {
                this.rolls = rolls;
                return;
            }

            for (let i = 0; i < this.numberOfRolls; i++) {
                const randomRoll = Math.floor(Math.random() * this.totalSides) + 1
                if (randomRoll <= this.yellowSides) {
                    rolls.push('yellow')
                } else if (randomRoll <= this.yellowSides + this.blueSides) {
                    rolls.push('blue')
                } else if (randomRoll <= this.yellowSides + this.blueSides + this.redSides){
                    rolls.push('red')
                } else if (randomRoll <= this.yellowSides + this.blueSides + this.redSides + this.lightblueSides) {
                    rolls.push('lightblue')
                } else if (randomRoll <= this.yellowSides + this.blueSides + this.redSides + this.lightblueSides + this.greenSides){
                    rolls.push('green')
                } else if (randomRoll <= this.yellowSides + this.blueSides + this.redSides + this.lightblueSides + this.greenSides + this.orangeSides) {
                    rolls.push('orange')
                } else if (randomRoll <= this.yellowSides + this.blueSides + this.redSides + this.lightblueSides + this.greenSides + this.orangeSides + this.pinkSides){
                    rolls.push('pink')
                } else {
                    rolls.push('black')
                } 
                
            }
            this.rolls = rolls
        },
        changeDiceMode() {
            this.useDiyDice = !this.useDiyDice;

            this.redSides = 0;
            this.yellowSides = 0;
            this.blueSides = 0;
            
            this.lightblueSides = 0;
            this.greenSides = 0;
            this.orangeSides = 0;
            this.pinkSides = 0;
            this.blackSides = 0;

            this.$emit('dice-changed', this.id);

        },
        setDiceSides() {
            var dice = this.$refs.diceSelect.value;

            switch(dice) {
                case 'nodice':
                    this.redSides = 0;
                    this.yellowSides = 0;
                    this.blueSides = 0;
                    this.$emit('dice-changed', this.id);
                    break;
                case 'dice1':
                    this.redSides = 5;
                    this.yellowSides = 3;
                    this.blueSides = 2;
                    this.$emit('dice-changed', this.id);
                    break;
                case 'dice2':
                    this.redSides = 5;
                    this.yellowSides = 10;
                    this.blueSides = 5;
                    this.$emit('dice-changed', this.id);
                    break;
                default:
                    this.$emit('dice-changed', this.id);
            }

        },
        

    }
}
</script>
