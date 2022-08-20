<template>
  <q-page class="column items-center justify-center">
    <div>
      <div>
        <h5 class="q-mb-sm">Usage:</h5>
        <ul>
          <li>If entering jumps at a later time, enter your last jump's previous information below.</li>
          <li>Add a jump with the + ADD SKYDIVE button.</li>
          <li>Enter in your exit and opening altitude.</li>
          <li>Press the + button.</li>
          <li>When you're done, copy the Freefall Delay and Total Time to your logbook for your jumps.</li>
        </ul>
      </div>
      <div class="q-my-lg flex row justify-around">
        <q-input
          class="q-mr-lg"
          type="number"
          v-model.number="previousJumpNumber"
          label="Previous Jump Number"
        />
        <q-input
          class="q-mr-lg"
          type="number"
          v-model.number="previousHours"
          label="Previous Total Hours"
        />
        <q-input
          class="q-mr-lg"
          type="number"
          v-model.number="previousMinutes"
          label="Previous Total Minutes"
        />
        <q-input
          class="q-mr-lg"
          type="number"
          v-model.number="previousSeconds"
          label="Previous Total Seconds"
        />

      </div>
      <q-table
        class="q-my-xl"
        title="Skydives"
        :columns="tableColumns"
        :rows="skydiveDataComplete"
      >
        <template v-slot:body-cell-remove="props">
          <q-td :props="props">
            <q-btn
              @click="removeJumpByJumpNumber(props.row.jumpNumber)"
              color="red"
              round
              dense
            >
              <q-icon
                name="close"
                size="small"
                color="white"/>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-totalTime="props">
          <q-td :props="props">
            {{ formatTime(props.row.totalTime) }}
          </q-td>
        </template>
      </q-table>
      <q-btn
        color="green"
        @click="showAddSkydiveModal = true"
      >
        <q-icon
          name="add"
        ></q-icon>
        Add Skydive
      </q-btn>
    </div>
    <modal-add-skydive
      v-if="showAddSkydiveModal"
      :show="showAddSkydiveModal"
      :current-number-of-jumps="previousJumpNumber"
      @add-skydive="addSkydive"
      @close-add-skydive="showAddSkydiveModal = false"
      @hide="showAddSkydiveModal = false"
     />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue';
import ModalAddSkydive from 'components/ModalAddSkydive.vue';
import { Skydive, SkydiveComplete } from 'src/types/SkydiveTypes';

const FIRST_THOUSAND_FREEFALL_SECONDS = 10
const TERMINAL_FALLRATE_PER_THOUSAND = 5

// Local Data
const previousJumpNumber = ref(0)
/**
 * Hours previous to the current entries
 */
const previousHours = ref(0)
/**
 * Minutes previous to the current entries
 */
const previousMinutes = ref(0)
/**
 * Seconds previous to the current entries
 */
const previousSeconds = ref(0)
/**
 * Whether or not to show the add skydive modal
 */
const showAddSkydiveModal = ref(false)
/**
 * Current added skydives
 */
const skydiveData: Ref<Array<Skydive>> = ref([])

// Table Config
const tableColumns = [
  {
    name: 'remove',
    label: 'Delete',
  },
  {
    name: 'jumpNumber',
    label: 'Jump Number',
    field: 'jumpNumber',
  },
  {
    name: 'exitAltitude',
    label: 'Exit Altitude (K ft.)',
    field: 'exitAltitude',
  },
  {
    name: 'openingAltitude',
    label: 'Opening Altitude (K ft.)',
    field: 'openingAltitude',
  },
  {
    name: 'freefallDelay',
    label: 'Freefall Delay (Seconds)',
    field: 'freefallDelay',
  },
  {
    name: 'totalTime',
    label: 'Total Time (HH:MM:SS)',
    field: 'totalTime',
  },
]

/**
 * Calculates the freefall time based on the altitude difference between exit and opening altitude
 * @param altitudeDifference - the difference in altitude from exit to opening
 */
const calculateFreefallTime = (altitudeDifference: number) => {
  let freefallDelay = 0
  let altitude = altitudeDifference
  // figure out delay from this jump
  if (altitude > 1) {
    // add first thousand constant
    freefallDelay += FIRST_THOUSAND_FREEFALL_SECONDS
    altitude -= 1
    freefallDelay += altitude * TERMINAL_FALLRATE_PER_THOUSAND
  } else { // altitude difference is less than 1K
    freefallDelay = altitudeDifference * FIRST_THOUSAND_FREEFALL_SECONDS
  }
  return freefallDelay
}

const previousTotalTime = computed<number>(() => previousHours.value * 3600 + previousMinutes.value * 60 + previousSeconds.value)

/**
 * Computes the complete skydives with freefall delay and total freefall time
 */
const skydiveDataComplete: ComputedRef<Array<SkydiveComplete>> = computed(() => {
  return skydiveData.value.reduce((completeSkydives: SkydiveComplete[], currentSkydive, index) => {
    // for first skydive previous total time = 0
    const previousSkydiveTotalTime = index ? completeSkydives[index - 1]?.totalTime : previousTotalTime.value
    const currentFreefallDelay = calculateFreefallTime(currentSkydive.exitAltitude - currentSkydive.openingAltitude);
    const totalTime = currentFreefallDelay + previousSkydiveTotalTime;
    // make a complete skydive
    const completeSkydive: SkydiveComplete = {
      ...currentSkydive,
      freefallDelay: currentFreefallDelay,
      totalTime,
    }
    // add to array
    completeSkydives.push(completeSkydive)
    return completeSkydives
  }, [])
})

/**
 * Handles adding a skydive
 * @param skydive - the skydive data to add
 */
const addSkydive = (skydive: Skydive) => {
  skydiveData.value.push(skydive)
  skydiveData.value.sort((a, b) => a.jumpNumber - b.jumpNumber)
  showAddSkydiveModal.value = false
  previousJumpNumber.value += 1
}

/**
 * Formats the time to HH:MM:SS
 * @param seconds - total seconds
 */
const formatTime = (seconds: number): string => {
  // function to return number with a leading 0
  const padWithZero = (num: number) => (num.toString().length === 1 ? `0${num}` : num)

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const remainingSeconds = seconds % 3600 % 60

  return `${padWithZero(hours)}h : ${padWithZero(minutes)}m : ${padWithZero(remainingSeconds)}s`
}

/**
 * Removes a jump from skydiveData based on the number
 * @param jumpNumber - jump number to remove
 */
const removeJumpByJumpNumber = (jumpNumber: number) => {
  skydiveData.value = skydiveData.value.filter((jump) => jump.jumpNumber !== jumpNumber)
}
</script>
