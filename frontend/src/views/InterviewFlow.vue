<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Progress Bar -->
    <div class="card mb-8">
      <div class="flex items-center justify-between mb-4">
        <div v-for="(step, index) in steps" :key="index" class="flex-1">
          <div class="flex items-center">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                currentStep > index ? 'bg-green-500 text-white' : 
                currentStep === index ? 'bg-primary-600 text-white' : 
                'bg-gray-300 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div v-if="index < steps.length - 1" 
                 :class="[
                   'flex-1 h-1 mx-2',
                   currentStep > index ? 'bg-green-500' : 'bg-gray-300'
                 ]"
            ></div>
          </div>
          <p class="text-xs mt-2 text-center text-white">{{ step }}</p>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="card">
      <component 
        :is="currentComponent" 
        @next="handleNext"
        @back="handleBack"
        :data="formData"
        @update="updateData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import StepInitial from '../components/StepInitial.vue';
import StepExperience from '../components/StepExperience.vue';
import StepTechnical from '../components/StepTechnical.vue';
import StepReport from '../components/StepReport.vue';

const currentStep = ref(0);
const steps = ['Inicial', 'Experiência', 'Técnica', 'Relatório'];

const formData = ref({
  sessionId: null,
  candidateInfo: {
    interviewDateTime: '',
    technicalReference: '',
    jobNumber: '',
    client: '',
    jobTitle: '',
    jobLink: '',
    name: '',
    email: '',
    recruiter: '',
    resume: null
  },
  experienceNotes: {
    mainExperiences: '',
    technologies: '',
    challenges: '',
    strengths: '',
    communication: ''
  },
  technicalAnswers: [],
  selectedCategories: [],
  situation: '',
  finalNotes: '',
  report: null,
  pdfFileName: null
});

const components = [StepInitial, StepExperience, StepTechnical, StepReport];

const currentComponent = computed(() => components[currentStep.value]);

const handleNext = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const updateData = (key, value) => {
  if (key.includes('.')) {
    const [parent, child] = key.split('.');
    formData.value[parent][child] = value;
  } else {
    formData.value[key] = value;
  }
};
</script>
