const ids = [
  "axe",
  "battery",
  "blowtorch",
  "bolt_cutters",
  "bp_low_teleporter",
  "bp_high_teleporter",
  "bp_reality_anchor",
  "crowbar",
  "battery",
  "bullet",
  "circuit_board",
  "cloth",
  "copper_coil",
  "keycard_a",
  "keycard_b",
  "keycard_c",
  "keycard_d",
  "keycard_e",
  "machete",
  "maintenance_key",
  "medical_pill",
  "metal_detector",
  "pistol",
  "plastic",
  "rope",
  "scrap_metal",
  "shotgun_shell",
  "shovel",
  "steel_shard",
  "syringe",
  "alient_fragment",
  "wire",
  "wood_stick"
];

const resources = {};

ids.forEach((id) => {
  resources[id] = false;
});

export default resources;