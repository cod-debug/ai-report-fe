<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-black text-white">
        <q-spinner-tail size="2rem" v-if="sendPromptData.loading" />
        <div class="whole-page q-pa-md">
          <div class="action-btn-holder">
            <div class="btn-top-actions">
              <q-btn label="Print Response" flat @click="printResult" class="full-width" />
            </div>
            <div class="btn-top-actions">
              <q-btn label="Export to PDF" flat @click="exportToPdf" class="full-width" />
            </div>
          </div>
          <div class="response-holder container">
            <div class="left-side">
              <div class="relative">
                <q-input
                  class="additional-input text-white"
                  v-model="AdditionalPrompt"
                  label="Additional Promt Base on the Result"
                  type="textarea"
                  outlined
                  color="accent"
                ></q-input>
                <q-btn label="Send" class="btn-sendPromt" color="primary" filled @click="sendAdditionalPrompt" />
              </div>

              <q-section class="text-section">
                <div class="text-p">{{ outputMessageTitle }}</div>
                <div class="output-text text-p q-mt-md">{{ outputText }}</div>
              </q-section>
            </div>

            <div class="right-side">
              <q-card class="result-container">
                <q-card-section v-if="showChart">
                  <Bar :data="chartData" :options="chartOptions" class="result-chart" />
                </q-card-section>

                <q-card-section>
                  <div class="text-p">{{ resultMessageTitle }}</div>
                  <div class="output-text text-p q-mt-md">{{ resultText }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="query-btn-container">
            <q-btn
              v-for="btn in buttons"
              :key="btn.label"
              :label="btn.label"
              :color="btn.color"
              class="query-btn"
              @click="handleButtonClick(btn.label)"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { promptStore } from 'src/stores/prompt.js';
import { storeToRefs } from 'pinia';

const $promptStore = promptStore();

const { sendPromptData } = storeToRefs($promptStore);
const { sendPrompt } = $promptStore;

// Register Chart.js components
Chart.register(...registerables)

const showChart = ref(false)
const AdditionalPrompt = ref('')

const chartData = ref({
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'AHT Data',
      data: [10, 20, 30, 25],
      backgroundColor: ['#ec0505', '#7c0303', '#ec0505', '#7c0303'],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
})

const resultMessageTitle = ref('')
const resultText = ref()

const typeText = (target, text, speed = 50) => {
  let i = 0
  target.value = ''

  const typingInterval = setInterval(() => {
    if (i < text.length) {
      target.value += text.charAt(i)
      i++
    } else {
      clearInterval(typingInterval)
    }
  }, speed)
}

const handleButtonClick = async (btnLabel) => {
  let payload = {
    prompt: btnLabel,
  }

  await sendPrompt(payload);
  const response = sendPromptData;
  console.log(response);
}

const buttons = ref([
  { label: 'Generate the FCR for Supervisor 1', color: 'transparent' },
  { label: 'Generate Quarter View of AHT in Bar Graph', color: 'transparent' },
  { label: 'Generate Customer Satisfaction for Supervisor 1', color: 'transparent' },
  { label: 'Generate CRES for this month', color: 'transparent' },
  {
    label: 'Generate FCR per Supervisor for the previous month in Line Graph',
    color: 'transparent',
  },
])

const outputMessageTitle = ref('')
const outputText = ref('')

const sendAdditionalPrompt = () => {
  typeText(outputMessageTitle, "Here's the quarter view of AHT in Bar Graph")

  typeText(outputText, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry')
}
</script>

<style scope lang="scss">

.action-btn-holder {
  width: 100%;
  background: transparent;
  display: flex;
  gap: 20px;
  justify-content: end;
  padding-right: 20px;
  margin-bottom: 10px;
}

.btn-top-actions {
  color: rgb(247, 241, 241);
  width: 200px;
  background: linear-gradient(to right, $secondary 0%, $accent 15%, $accent 84%, $secondary 100%);
  border-radius: 10px;
  padding: 1px 0;
  overflow: hidden;
}

.btn-top-actions .q-btn {
  background-color: $secondary;
}

.container {
  display: flex;
  gap: 40px;
}

.left-side, 
.right-side {
  background: linear-gradient(to top, $dark 25%, $dark-page);
}

.left-side,
.right-side {
  box-shadow: inset 0 0 3px 1px black;
  border-radius: 5px;
}

.left-side {
  width: 65%;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.right-side {
  width: 35%;
  display: flex;
  flex-direction: column;
}

.propmt-card {
  background: transparent;
  border: 1px solid rgb(233, 238, 237);
  color: rgb(42, 221, 197);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.additional-input {
  transition: none;
  width: 100%;
}

.additional-input:focus {
  border: none;
  outline: none;
}

.btn-sendPromt {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

.relative {
  position: relative;
}

.output-text {
  text-align: justify;
}

.result-container {
  background: transparent;
}

.result-chart {
  height: 250px;
  background: rgb(14, 13, 13);
}

.query-btn-container {
  border-radius: 5px;
  background: linear-gradient(to top, $dark 28%, $dark-page);
  padding: 1rem;
  max-height: 15vh;
  overflow: auto;
}

.query-btn {
  margin: 5px;
  border: 1px solid white;
}

.query-btn:hover {
  background: white;
}

.whole-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .response-holder {
    flex-grow: 1;
  }
}

.additional-input .q-field__control.relative-position.row.no-wrap {
  border: 1px solid;
}
.additional-input .q-field__label {
  color: $primary;
}
.additional-input .q-field__native {
  color: $white!important;
}
</style>
