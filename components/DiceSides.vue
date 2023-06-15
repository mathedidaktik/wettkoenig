<template>
     <div class="flex flex-col items-start">
        <label :class="classColor" class="text-lg font-medium w-full block">{{ text }}</label>
        <input type="number" class="border-gray-300 border rounded-md px-3 py-2 w-full block"  min="0" max="1000" v-bind:keyup=enforceMinMax() v-bind:keydown=sidesChanged() v-model="sides">
    </div>
    <label v-if="warningSites" class="text-red-700">Die Seitenanzahl der einzelnen farben muss mindestens 0 und maximal 1000 betragen.</label>
</template>

<script>
    export default {
        props: ['text', 'classColor'],
        data() {
            return {
                sides: 0,
                warningSites: false,
            }
        },
        methods: {
            enforceMinMax() {
                if (this.sides < 0 | this.sides > 1000) {
                    this.warningSites = true;
                }
                else {
                    this.warningSites = false;
                }
                this.$emit('warning-sites', this.sides);
            },
            sidesChanged() {
                this.$emit('sides-changed', this.text, this.sides);
            }
        }
    }
</script>