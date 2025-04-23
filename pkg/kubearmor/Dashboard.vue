<template>
  <Console v-if="hasKubearmor" :url="consoleUrl" />
  <Install v-else />
</template>

<script>
import { WORKLOAD_TYPES } from "@shell/config/types";
import Install from "./components/Install.vue";
import Console from "./components/Console.vue";

export default {
  name: "Dashboard",
  layout: "single",

  async beforeMount() {
    try {
      // Check for the KubeArmor operator by name and namespace
      const operatorDeployment = await this.$store.dispatch("cluster/find", {
        type: WORKLOAD_TYPES.DEPLOYMENT,
        id: "kubearmor/kubearmor-operator"
      });

      // If found, set operatorPresence to true
      this.operatorPresence = !!operatorDeployment;
      this.consoleUrl = "https://kubearmor.io/";

    } catch (error) {
      // If not found, operatorPresence remains false
      this.operatorPresence = false;
      console.error("KubeArmor operator not found:", error);
    }
  },

  components: {
    Install,
    Console,
  },

  data() {
    return {
      consoleUrl: "",
      operatorPresence: false
    };
  },

  computed: {
    hasKubearmor() {
      return this.operatorPresence;
    }
  }
};
</script>
