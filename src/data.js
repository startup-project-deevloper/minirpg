export const mainFlow = [
  {
    id: "m1",
    actor: "daryl",
    from: null,
    to: null,
    text: "This is the first message, what will you choose?",
    choices: [
      {
        id: "m1a",
        actor: "player",
        from: "m1",
        to: "m2",
        text: "I will select A.",
        choices: [],
        actions: []
      },
      {
        id: "m1b",
        actor: "player",
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
    actor: "daryl",
    from: "m1a",
    to: "m4",
    text: "This is if you select A.",
    choices: [],
    actions: []
  },
  {
    id: "m3",
    actor: "daryl",
    from: "m1b",
    to: null,
    text: "This is if you select B.",
    choices: [],
    actions: ["cancel"]
  },
  {
    id: "m4",
    actor: "daryl",
    from: "m2",
    to: null,
    text: "This should be the last in the chain for A.",
    choices: [],
    actions: ["endConversation", "save"]
  }
];
