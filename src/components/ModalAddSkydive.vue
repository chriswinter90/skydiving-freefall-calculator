<template>
  <q-dialog
    :model-value="props.show"
  >
    <q-card class="q-mx-lg" style="width: 300px">
      <q-form @submit.prevent.stop="addSkydive">
        <q-card-section>
          <h6 class="q-my-md">Add Skydive</h6>
        </q-card-section>
        <q-card-section>
          <q-input
            label="Jump Number"
            v-model.number="jumpNumber"
            :rules="[isANumberValidation, isAWholeNumberValidation]"
            mask="#####"
          ></q-input>
          <q-input
            label="Exit Altitude (K)"
            type="number"
            v-model.number="exitAltitude"
            :step="0.1"
            :rules="[isANumberValidation]"
          ></q-input>
          <q-input
            label="Opening Altitude (K)"
            type="number"
            v-model.number="openingAltitude"
            :step="0.1"
            :rules="[isANumberValidation]"
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            type="submit"
          >
            <q-icon
              name="add"
              color="positive"
            ></q-icon>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Skydive } from 'src/types/SkydiveTypes';

interface Props {
  show: boolean
  currentNumberOfJumps: number
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  currentNumberOfJumps: 0,
});

const isANumberValidation = (val: any) => typeof val === 'number' || 'The value must be a number'
const isAWholeNumberValidation = (val: any) => val % 1 === 0 || 'The value must be a whole number'

const jumpNumber = ref(props.currentNumberOfJumps + 1)
const exitAltitude = ref(13.5)
const openingAltitude = ref(0)

const emit = defineEmits<
  {
    (e: 'add-skydive', skydive: Skydive): Skydive,
    (e: 'close-add-skydive'): void,
  }
>()

const addSkydive = () => {
  emit('add-skydive', {
    jumpNumber: jumpNumber.value,
    exitAltitude: exitAltitude.value,
    openingAltitude: openingAltitude.value,
  })
}

</script>
