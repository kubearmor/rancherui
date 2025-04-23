import { Policy } from './kubearmor';

export const DEFAULT_POLICY: Policy = {
  apiVersion: '', 
  kind: '',  
  metadata: {
    name: '',
    namespace: ''
  },
  spec: {
    tags: [], 
    message: '',          
    action: 'Block',      
    severity: 1,          

    selector: {
      matchLabels: {}   
    },
    process: {
      matchPaths: [],     
      matchDirectories: [], 
      matchPatterns: []    
    },

    file: {
      action: 'Block',       
      matchPaths: [],         
      matchDirectories: [],  
      matchPatterns: []      
    },

    network: {
      matchProtocols: [] 
    },
}
}


export const ARTIFACTHUB_ENDPOINT = 'artifacthub.io/api/v1';

export const ARTIFACTHUB_PKG_ANNOTATION = 'artifacthub/pkg';

export const VALIDATION_KEYS = [
  'allowed',
  'host',
  'kind',
  'mutated',
  'name',
  'namespace',
  'operation',
  'policy_id',
  'response_message',
  'response_code',
];

// export const RANCHER_NAMESPACES = [
//   'calico-system',
//   'cattle-alerting',
//   'cattle-fleet-local-system',
//   'cattle-fleet-system',
//   'cattle-global-data',
//   'cattle-global-nt',
//   'cattle-impersonation-system',
//   'cattle-istio',
//   'cattle-logging',
//   'cattle-pipeline',
//   'cattle-prometheus',
//   'cattle-system',
//   'cert-manager',
//   'ingress-nginx',
//   'kube-node-lease',
//   'kube-public',
//   'kube-system',
//   'rancher-operator-system',
//   'security-scan',
//   'tigera-operator',
// ];

// export const RANCHER_NS_MATCH_EXPRESSION: V1LabelSelectorRequirement = {
//   key:      'kubernetes.io/metadata.name',
//   operator: 'NotIn',
//   values:   RANCHER_NAMESPACES,
// };

export const MODE_MAP = {
  monitor: 'bg-info',
  protect: 'bg-warning',
};

export const OPERATION_MAP = {
  '*':     'bg-darker',
  CREATE:  'bg-info',
  UPDATE:  'bg-warning',
  DELETE:  'bg-error',
  CONNECT: 'bg-success',
};

/* eslint-disable no-unused-vars */
export enum VALUES_STATE {
  FORM = 'FORM',
  YAML = 'YAML',
}
/* eslint-enable no-unused-vars */

export const YAML_OPTIONS = [
  {
    labelKey: 'catalog.install.section.chartOptions',
    value:    VALUES_STATE.FORM,
  },
  {
    labelKey: 'catalog.install.section.valuesYaml',
    value:    VALUES_STATE.YAML,
  }
];
