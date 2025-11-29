

let globalState = null;

export function get_global_state() {
  return globalState;
}

export function set_global_state(state) {
  globalState = state;
}

export function parse_input_json(jsonStr) {
  const obj = JSON.parse(jsonStr);
  
  return {
    start: obj.start || false,
    restart: obj.restart || false,
    switch_spectre: obj.switch_spectre || false,
    move_left: obj.move_left || false,
    move_right: obj.move_right || false,
  };
}





