<template>
  <div class="chat">
    <h1>Wakanda AI</h1>
    <div>
      <label for="character-select">Select a character:</label>
      <select id="character-select" v-model="selectedCharacter">
        <option disabled value="">Please select a character</option>
        <option
          v-for="character in characters"
          :key="character"
          :value="character"
        >
          {{ character }}
        </option>
      </select>
    </div>
    <div>
      <label for="user-question">Your question:</label>
      <input
        id="user-question"
        type="text"
        v-model="userQuestion"
        placeholder="Type your question here"
      />
      <button @click="submitQuery">Ask</button>
    </div>
    <div v-if="loading" class="loading-indicator">Loading...</div>
    <div v-if="response">
      <h2>Response:</h2>
      <div class="response-container">
        <img :src="characterImage" alt="Character" class="character-icon" />
        <p>{{ response }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import axios from "axios";

export default {
  name: "WakandaChat",
  setup() {
    const characters = [
      "Namor",
      "Shuri",
      "Mbaku",
      "Okoye",
      "Queen Ramonda",
      "Nakia",
      "Riri",
      "Killmonger",
    ];
    const selectedCharacter = ref("");
    const userQuestion = ref("");
    const response = ref("");
    const backendURL = "https://wakandai.onrender.com";
    const loading = ref(false);

    const getCharacterImage = (characterName) => {
      try {
        return require(`@/assets/characters/${characterName}.jpg`);
      } catch (error) {
        console.error(`Failed to load image for character: ${characterName}`);
        return "";
      }
    };

    const characterImage = computed(() => {
      if (selectedCharacter.value) {
        return getCharacterImage(selectedCharacter.value);
      }
      return "";
    });

    watch(selectedCharacter, () => {
      response.value = "";
    });

    const submitQuery = async () => {
      if (selectedCharacter.value && userQuestion.value) {
        loading.value = true;
        try {
          const { data } = await axios.get(`${backendURL}/api/wakanda-ai`, {
            params: {
              character: `Character : ${selectedCharacter.value}.\n`,
              question: `Question : ${userQuestion.value}\n`,
            },
          });
          if (data && data.text) {
            response.value = data.text;
          }
        } catch (error) {
          console.error(
            "Error while fetching response from the backend:",
            error
          );
        } finally {
          loading.value = false;
        }
      }
    };

    return {
      characters,
      selectedCharacter,
      userQuestion,
      response,
      submitQuery,
      loading,
      characterImage,
    };
  },
};
</script>

<style scoped>
.chat {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: "Roboto", sans-serif;
  background-color: #000;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #fff;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #f5ab35;
}

label {
  font-size: 1.1rem;
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid #f5ab35;
  border-radius: 5px;
  margin-bottom: 15px;
}

button {
  padding: 10px 20px;
  background-color: #f5ab35;
  color: #000;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #e89c30;
}

@keyframes spinning {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-indicator {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  color: #f5ab35;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-indicator::before {
  content: "";
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #f5ab35;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spinning 1s linear infinite;
  margin-right: 10px;
}

.response-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.character-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid #f5ab35;
  border-radius: 5px;
}
select > option {
  background: black;
  color: #fff;
}
</style>
