interface NetworkProfile {
  type: true;
  networkProfile: string;
}

interface NoNetworkProfile {
  type: false;
}

export { NetworkProfile, NoNetworkProfile };
