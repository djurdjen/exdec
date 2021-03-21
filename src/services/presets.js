const transportation = [
  { val: "car", name: "Auto" },
  { val: "train", name: "Trein" },
  { val: "tram", name: "Tram" },
  { val: "bus", name: "Bus" },
  { val: "metro", name: "Metro" },
];

const getName = (id) => {
  return transportation.find((t) => t.val === id).name;
};

export { transportation, getName };
