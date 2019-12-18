class AgentEnv {
  constructor(map, animation_interval) {
    this.map = map;
    this.animation_interval = animation_interval;
    this.driverAgents = null;
    this.passengerAgents = null;
    this.state = {
      running: false,
      paused: false,
      animation_frame_id: null, // whats this
      ticks: null
    };
  }
}

export default AgentEnv;
