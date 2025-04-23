<style lang="scss" scoped>
.reporter-panel {
  display: none;
}
</style>

<script>
import { NODE, WORKLOAD_TYPES } from '@shell/config/types';
import SortableTable from '@shell/components/SortableTable/index'
import ResourceList from '@shell/components/ResourceList'
import { allHash } from '@shell/utils/promise';
import ResourceFetch from '@shell/mixins/resource-manager';
import { DAEMONSET_HEADERS, DEPLOYMENT_HEADERS, NODELIST_HEADERS } from '../../../../config/table-headers';
import Install from '../../../../components/Install.vue';

export default {
  async beforeMount() {
    const hash = {};
    const types = [


      WORKLOAD_TYPES.DAEMON_SET,
      WORKLOAD_TYPES.DEPLOYMENT,
      NODE


    ];

    for (const type of types) {
      if (this.$store.getters['cluster/canList'](type)) {
        hash[type] = this.$store.dispatch('cluster/findAll', { type });
      }
    }


    await allHash(hash);
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
  data() {
    return { DAEMONSET_HEADERS, DEPLOYMENT_HEADERS, NODELIST_HEADERS,consoleUrl: "",operatorPresence: false };
  },

  computed: {
    hasKubearmor() {
      return this.operatorPresence;
    },
    allDaemonSets() {
      return this.$store.getters['cluster/all']({ type: WORKLOAD_TYPES.DAEMON_SET });
    },
    allDeployments() {
      return this.$store.getters['cluster/all'](WORKLOAD_TYPES.DEPLOYMENT);
    },
    allNodes() {
      return this.$store.getters['cluster/all'](NODE);
    },
    kADeployments() {
      return this.allDeployments?.filter(svc => svc?.metadata?.labels?.['kubearmor-app']);
    },
    kADaemonSets() {
      return this.allDaemonSets?.filter(svc => svc?.metadata?.labels?.['kubearmor-app']);
    },

  },
  methods: {
    logComputedValue() {
      console.log(this.kADeployments);
    }
  },
  mounted() {
    console.log('Initial computed value:', this.kADeployments);
  },

  components: { SortableTable, ResourceList,Install },
}
</script>

<template>

  <div v-if="hasKubearmor" :url="consoleUrl">
    <h1>KubeArmor Probe</h1>
    <br /><br />


    <h2>DaemonSets</h2>
    <SortableTable :headers="DAEMONSET_HEADERS" :rows="kADaemonSets" :rowActions="true"
      titleSlot='<div style="background: red; color: red">DaemonSets</div>' />
    <br /> <br />


    <h2>Deployments</h2>
    <SortableTable :headers="DEPLOYMENT_HEADERS" :rows="kADeployments" :rowActions="true"
      titleSlot='<div style="background: red; color: red">DaemonSets</div>' />
    <br /> <br />


    <h2>Nodelist</h2>
    <SortableTable :headers="NODELIST_HEADERS" :rows="allNodes" :rowActions="true"
      titleSlot='<div style="background: red; color: red">DaemonSets</div>' />
    <br /> <br />

  </div>
  <Install v-else/>

</template>