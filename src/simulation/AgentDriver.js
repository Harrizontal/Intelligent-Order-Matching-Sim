import AgentEnv from "./AgentEnv";
class AgentDriver {
  constructor(map) {
    this.steps_made = 0;
    this.trip = {
      paused: false,
      moving: false,
      current_point: null,
      goal_point: null,
      lat: null,
      lng: null,
      speed: null,
      path: []
    };
  }

  start() {
    if (this.trip.path.length > 0) {
      this.travelTo(this.trip.path[0]);
    }
  }

  pause() {
    this.trip.paused = true;
  }

  resume() {
    this.trip.paused = false;
  }

  travelTo(goal_point) {}
}

export default AgentDriver;
