<template>
  <q-dialog
    :model-value="props.show"
  >
    <q-card>
      <q-card-section>
        <h6>Add Skydive</h6>
      </q-card-section>
      <q-card-section>
        <q-input
          label="Jump Number"
          v-model="jumpNumber"
          mask="#####"
        ></q-input>
        <q-input
          label="Exit Altitude (K)"
          v-model="exitAltitude"
          mask="##.###"
        ></q-input>
        <q-input
          label="Opening Altitude (K)"
          v-model="openingAltitude"
          mask="##.###"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          @click="addSkydive"
        >
          <q-icon
            name="add"
            color="green"
          ></q-icon>
        </q-btn>
      </q-card-actions>
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

const jumpNumber = ref(props.currentNumberOfJumps + 1)
const exitAltitude = ref(13.5)
const openingAltitude = ref(0)

const emit = defineEmits<
  {
    (e: 'add-skydive', skydive: Skydive): void,
    (e: 'add-skydive'): void,
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
