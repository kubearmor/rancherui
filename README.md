# KubeArmor Rancher UI

Welcome to the setup guide for integrating **KubeArmor** with **Rancher** using the custom extension. This guide will walk you through the installation of KubeArmor on your Kubernetes cluster managed by Rancher, and how to enable the KubeArmor extension for enhanced security features.

## Table of Contents

1. **[About KubeArmor](#about-kubearmor)**
2. **[Prerequisites](#prerequisites)**
3. **[Setting Up KubeArmor on Kubernetes](#setting-up-kubearmor-on-kubernetes)**
   - [Installation](#installation)
   - [Verification](#verification)
4. **[Integrating KubeArmor with Rancher](#integrating-kubearmor-with-rancher)**
   - [Install Rancher](#install-rancher)
   - [Access Rancher UI](#access-rancher-ui)
5. **[Using KubeArmor via Rancher](#using-kubearmor-via-rancher)**
6. **[Troubleshooting](#troubleshooting)**

## About KubeArmor

**KubeArmor** is a runtime security enforcement system for Kubernetes, which allows you to restrict the behavior of pods, containers, and nodes at the system level. It leverages Linux Security Modules like AppArmor, SELinux, or BPF-LSM for policy enforcement, providing:
- **Process Whitelisting**
- **Network Whitelisting**
- **File Access Control**
- **System Call Profiling**

## Prerequisites

Before you start, ensure you have:
- A Kubernetes cluster set up with Rancher managing it.
- `kubectl` configured to communicate with your Kubernetes cluster.
- Helm v3 installed on your local machine.

## Setting Up KubeArmor on Kubernetes

### Installation

   ```sh
   helm repo add kubearmor https://kubearmor.github.io/charts
   helm repo update kubearmor
   helm upgrade --install kubearmor-operator kubearmor/kubearmor-operator -n kubearmor --create-namespace
   kubectl apply -f https://raw.githubusercontent.com/kubearmor/KubeArmor/main/pkg/KubeArmorOperator/config/samples/sample-config.yml
   ```

## Verification

<details>
  <summary>Deny execution of package management tools (apt/apt-get)</summary>

Package management tools can be used in the runtime env to download new binaries that will increase the attack surface of the pods. Attackers use package management tools to download accessory tooling (such as `masscan`) to further their cause. It is better to block usage of package management tools in production environments.

Lets apply the policy to block such execution:

```
cat <<EOF | kubectl apply -f -
apiVersion: security.kubearmor.com/v1
kind: KubeArmorPolicy
metadata:
  name: block-pkg-mgmt-tools-exec
spec:
  selector:
    matchLabels:
      app: nginx
  process:
    matchPaths:
    - path: /usr/bin/apt
    - path: /usr/bin/apt-get
  action:
    Block
EOF
```

Now execute the `apt` command to download the `masscan` tool.
```
kubectl exec -it $POD -- bash -c "apt update && apt install masscan"
```

It will be denied permission to execute.

```
sh: 1: apt: Permission denied
command terminated with exit code 126
```

If you don't see Permission denied please refer [here](FAQ.md#debug-kubearmor-installation-issue-in-dockerized-kubernetes-environment) to debug this issue

</details>

## Integrating KubeArmor with Rancher

### Access Rancher UI

- **Log into Rancher:** Open your web browser and navigate to your Rancher server's URL, then log in with your credentials.

### Add KubeArmor Extension

1. **Navigate to Extensions:**
   - From the top navigation bar, click on the hamburger menu (☰), and select `Extensions` under the `Configuration` section.


2. **Search for KubeArmor:**
   - If the KubeArmor extension is listed in the Rancher **Available** tab:
     - Look for the KubeArmor extension in the list.
     - Click on `Install` next to the KubeArmor entry.

   - If it's not listed:
     - You might need to manually add the extension:
       - **Add Custom Repository:** Click on `⋮` in the upper right corner and select `Manage Repositories` and click `create` button in the upper right corner.
       - **Enter the required details:**
        - `Name`: Accuknox
        - `Target`: Git repository containing Helm chart or cluster template definitions
        - `Git Repo URL`: https://github.com/kubearmor/rancherui
        - `Git Branch`: gh-pages
        - Click on `create` button in the lower right corner 
       - After adding the repository, go back to your `Extensions` section under the `Configuration section`  

3. **Install KubeArmor Extension:**
   - Click on the **Available** tab to search for extensions to add.
   - Click `Install`

4. **Installation Process:**
   - Once you click `Install`, Rancher will handle the deployment of the extension. 
   - You might see a progress wheel or status change indicating the installation is in process.
   - Once install you need to reload your rancher instance which can be done by clicking `reload` button in the upper right section.

   - **Note:** The exact steps might vary slightly depending on how the KubeArmor extension is packaged or if it requires additional configuration before installation.

5. **Verify Installation:**
   - Go back to the **Installed** tab in `Extensions`.
   - Ensure KubeArmor appears in the list with a status indicating it's active or healthy.

### Using Kubearmor via Rancher

1. **Access KubeArmor Interface in Rancher:**
  - After the extension is installed, navigate to the cluster where KubeArmor is deployed.
  - Locate the Kubearmor dropdown list in left side panel
  - **Create or Apply Policies:**
    - Use the provided interface to create new policies or apply existing ones. This typically involves specifying which workloads the policy applies to, what actions are allowed or denied, etc.



### Troubleshooting


- **Extension Not Visible:** 
  - Check if the extension repository was correctly added or if there are network issues preventing the extension from being fetched.

- **Installation Failed:** 
  - Look at the Rancher logs or the installation logs in the `kubearmor` namespace for any errors or warnings that could explain the failure.

- **Policies Not Enforcing:**
  - Confirm that the policies are correctly applied to the targeted workloads. Check KubeArmor's logs for enforcement details or any errors.


