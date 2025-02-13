<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-md bg-dark text-white">
        <div class="action-btn-holder">
          <q-btn label="Print Response" class="btn-print" @click="printResult" />
          <q-btn label="Export to PDF" class="btn-export" @click="exportToPdf" />
        </div>

        <div class="container">
          <div class="left-side">
            <q-card class="propmt-card">
              <q-input
                class="additional-input"
                v-model="AdditionalPrompt"
                filled
                label="Additional Promt Base on the Result"
                type="textarea"
              ></q-input>
              <q-btn label="Send" class="btn-sendPromt" @click="sendPrompt" />
            </q-card>

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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import { Bar } from 'vue-chartjs'

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

const handleButtonClick = (btnLabel) => {
  switch (btnLabel) {
    case 'Generate Quarter View of AHT in Bar Graph':
      showChart.value = true

      typeText(resultMessageTitle, "Here's the quarter view of AHT in Bar Graph")

      typeText(
        resultText,
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      )
      break

    case 'Generate the FCR for Supervisor 2':
      typeText(resultMessageTitle, "Here's the FCR for Supervisor 2")

      typeText(
        resultText,
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      )
      break
  }
}

const buttons = ref([
  { label: 'Generate the FCR for Supervisor 2', color: 'transparent' },
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

const sendPrompt = () => {
  typeText(outputMessageTitle, "Here's the quarter view of AHT in Bar Graph")

  typeText(outputText, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry')
}
</script>

<style scope>
.action-btn-holder {
  width: 100%;
  background: transparent;
  display: flex;
  gap: 20px;
  justify-content: end;
  padding-right: 20px;
  margin-bottom: 10px;
}

.btn-print,
.btn-export {
  color: rgb(247, 241, 241);
  width: 200px;
  background: #d8071950;
}

.btn-export::before,
.btn-print::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 0.5px;
  background: #660202e7;
  box-shadow:
    0 0 1px #660202e7,
    0 0 1px #660202e7;
  transition: all 0.3s ease;
}

.btn-export::after,
.btn-print::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1px;
  background: #660202e7;
  box-shadow:
    0 0 1px #660202e7,
    0 0 10px #660202e7;
  transition: all 0.3s ease;
}

.container {
  display: flex;
  gap: 40px;
}

.left-side {
  width: 65%;
  height: 100vh;
  background: rgb(22, 22, 22);
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
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
  background: #660202e7;
  width: 100px;
  border-radius: 10px;
  color: white;
  margin: 10px 10px 10px auto;
}

.output-text {
  text-align: justify;
}

.right-side {
  background: rgb(22, 22, 22);
  width: 35%;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
}

.result-container {
  background: transparent;
}

.result-chart {
  height: 250px;
  background: rgb(14, 13, 13);
}

.query-btn-container {
  display: flex;
  margin: 10px 5px 10px 5px;
  gap: 10px;
}

.query-btn {
  border: 1px solid white;
}

.query-btn:hover {
  background: white;
}
</style>
