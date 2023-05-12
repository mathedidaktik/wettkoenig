<template>
    <div class="flex flex-col space-y-8">
        <button @click="changeDiceMode" class="button text-white rounded-md px-4 py-2" v-if="!useDiyDice">Baue deinen eingenen Würfel</button>
        <button @click="changeDiceMode" class="button text-white rounded-md px-4 py-2" v-if="useDiyDice">Nutze fertige Würfel</button>

        <div class="flex flex-col items-start">
            <label for="num-rolls" class="text-lg font-medium">Anzahl würfe:</label>
            <input type="number" id="num-rolls" class="border-gray-300 border rounded-md px-3 py-2 w-full" min="0" max="1000000" v-bind:keyup=enforceMinMax(this) v-model="numberOfRolls">
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
                <input type="number" id="red-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax(this) v-model="redSides">
            </div>

            <div v-if="!useDiyDice">
                <label for="yellow-sides" class="text-lg font-medium yellowInput w-full block">Gelbe Seiten: {{ yellowSides }}</label>
            </div>
            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="yellow-sides" class="text-lg font-medium yellowInput w-full block">Gelbe Seiten:</label>
                <input type="number" id="yellow-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax(this) v-model="yellowSides">
            </div>

            <div v-if="!useDiyDice">
                <label for="blue-sides" class="text-lg font-medium blueInput w-full block">Blaue Seiten: {{ blueSides }}</label>
            </div>
            <div class="flex flex-col items-start" v-if="useDiyDice">
                <label for="blue-sides" class="text-lg font-medium blueInput w-full block">Blaue Seiten:</label>
                <input type="number" id="blue-sides" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax(this) v-model="blueSides">
            </div>
        </div>
    </div>
</template>


<script>
    
    export default {

    data() {
        return {
        numberOfRolls: 0,
        yellowSides: 0,
        blueSides: 0,
        redSides: 0,
        rolls: [],
        useDiyDice: false,
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
        enforceMinMax(el) {
            console.log("befor if");
            if (el.value != "") {
                console.log("inside if");
                console.log(el);
                console.log("id: " + el.id)
                console.log("value: " + el.value + "min: " + el.min + "max: " + el.max)
                if (parseInt(el.value) < parseInt(el.min)) {
                    console.log(el);
                    el.value = el.min;
                }
                if (parseInt(el.value) > parseInt(el.max)) {
                    console.log(el);
                    el.value = el.max;
                }
            }
        },
        rollDice() {
            const rolls = [];

            if ((this.redSides + this.yellowSides + this.blueSides) <= 0) {
                this.rolls = rolls;
                return;
            }

            for (let i = 0; i < this.numberOfRolls; i++) {
                const randomRoll = Math.floor(Math.random() * (this.yellowSides + this.blueSides + this.redSides)) + 1
                if (randomRoll <= this.yellowSides) {
                    rolls.push('yellow')
                } else if (randomRoll <= this.yellowSides + this.blueSides) {
                    rolls.push('blue')
                } else {
                    rolls.push('red')
                }
            }
            this.rolls = rolls
        },
        changeDiceMode() {
            this.useDiyDice = !this.useDiyDice;

            this.blueSides = 0;
            this.yellowSides = 0;
            this.redSides = 0;

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
