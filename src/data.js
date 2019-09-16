export const mainFlow = [
  {
    id: "m1",
    from: null,
    to: null,
    text: "This is the first message",
    choices: [
      {
        id: "m1a",
        from: "m1",
        to: "m2",
        text: "I will select A.",
        choices: [],
        actions: []
      },
      {
        id: "m1b",
        from: "m1",
        to: "m3",
        text: "I will select B.",
        choices: [],
        actions: []
      }
    ],
    actions: []
  },
  {
    id: "m2",
    from: "m1a",
    to: "m4",
    text: "This is if you select A.",
    choices: [],
    actions: []
  },
  {
    id: "m3",
    from: "m1b",
    to: null,
    text: "This is if you select B.",
    choices: [],
    actions: ["cancel"]
  },
  {
    id: "m4",
    from: "m2",
    to: null,
    text: "This should be the last in the chain for A.",
    choices: [],
    actions: ["endConversation", "save"]
  }
];
