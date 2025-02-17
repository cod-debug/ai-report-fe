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
              <div class="relative" v-if="hasResult">
                <q-input
                  class="additional-input text-white"
                  v-model="additionalPrompt"
                  label="Additional Promt Base on the Result"
                  type="textarea"
                  outlined
                  color="accent"
                  :disable="sendPromptData.loading"
                ></q-input>
                <q-btn
                  label="Send"
                  class="btn-sendPromt"
                  color="primary"
                  filled
                  :disable="sendPromptData.loading"
                  @click="handleSendAdditionalPrompt"
                />
              </div>

              <q-card class="bg-transparent border border-primary" flat>
                <q-card-section>
                  <div v-if="sendAdditionalPromptData.loading" class="text-center">
                    <q-spinner></q-spinner>
                    <div>Analyzing data provided</div>
                  </div>
                  <div v-else>
                    <div v-html="typedAdditinonalResponse"></div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="right-side q-pa-md">
              <q-card class="result-container" flat>
                <q-card-section>
                  <div v-if="sendPromptData.loading" class="text-center">
                    <q-spinner></q-spinner>
                    <div>Analyzing data provided</div>
                  </div>
                  <div v-if="!sendPromptData.loading">
                    <q-card-section v-if="chartType === 'bar'">
                      <Bar :data="chartData" :options="chartOptions" class="result-chart" />
                    </q-card-section>
                    <div v-html="typedText"></div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="query-btn-container">
            <q-btn
              v-for="btn in buttons"
              :key="btn.label"
              :label="btn.label"
              :color="btn.label.toLowerCase() === selectedPrompt.toLowerCase() ? 'white' : btn.color"
              class="query-btn"
              :class="btn.label.toLowerCase() === selectedPrompt.toLowerCase() ? 'text-black' : ''"
              @click="handleButtonClick(btn.label)"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { promptStore } from 'src/stores/prompt.js';
import { storeToRefs } from 'pinia';

const $promptStore = promptStore();

const { sendPromptData, sendAdditionalPromptData } = storeToRefs($promptStore);
const { sendPrompt, sendAdditionalPrompt } = $promptStore;

// Register Chart.js components
Chart.register(...registerables)

const chartType = ref(false);
const additionalPrompt = ref('')
const selectedPrompt = ref('');
const currentRawData = ref(null);
const hasResult = ref(false)

const chartData = ref({
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'AHT Data',
      data: [0, 0, 0, 0],
      backgroundColor: ['#ec0505', '#7c0303', '#ec0505', '#7c0303'],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
})

const typedText = ref('')
const typedAdditinonalResponse = ref('');

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

const typeAdditionalResponseText = (text, speed = 10) => {
  let i = 0
  typedAdditinonalResponse.value = ''

  const typingAdditionalPromptInterval = setInterval(() => {
    if (i < text.length) {
      typedAdditinonalResponse.value += text.charAt(i)
      i++
    } else {
      clearInterval(typingAdditionalPromptInterval)
    }
  }, speed)
}
const watchAIResponse = (source, callback) => {
  watch(
    () => source.value.data,
    (newData) => {
      if (newData?.ai_response?.html_format) {
        callback(newData.ai_response.html_format);
      }
    }
  );
};

watchAIResponse(sendPromptData, typeText);
watchAIResponse(sendAdditionalPromptData, typeAdditionalResponseText);

const handleSendAdditionalPrompt = async () => {
  const payload = {
    raw_data: currentRawData.value,
    prompt: additionalPrompt.value,
  }

  await sendAdditionalPrompt(payload)
  
  additionalPrompt.value = "";
}

const handleButtonClick = async (btnLabel) => {
  selectedPrompt.value = btnLabel;
  let payload = {
    prompt: btnLabel,
  }

  await sendPrompt(payload)
  const response = sendPromptData.value.data;
  
  if(response.error){
    hasResult.value = false;
    return false;
  }

  hasResult.value = true;
  currentRawData.value = response.raw_data;
  chartType.value = response.graph;

  if (response && response.raw_data[0]?.average_handling_time) {
    response.raw_data.map((quarter, key) => {
      chartData.value.datasets[0].data[key] = quarter?.average_handling_time || 0;
    });
  }
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

const printResult = () => {
  alert('will be implemented soon');
}
const exportToPdf = () => {
  alert('will be implemented soon');
}
</script>
