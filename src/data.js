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
    text: "You have selected the A button.You have selected the A button.You have selected the A button.You have selected the A button.You have selected the A button.",
    choices: [],
    actions: []
  },
  {
    id: "m3",
    actor: "daryl",
    from: "m1b",
    to: null,
    text: "You have selected the B button.You have selected the B button.You have selected the B button.You have selected the B button.You have selected the B button.",
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

export const ENTITY_TYPE = {
  PICKUP: 0,
  NPC: 1,
  ENEMY: 2,
  SWITCH: 3,
  DOOR: 4,
  CONTAINER: 5,
  PLAYER: 99
}

export const entityData = [
  {
    id: "player",
    type: ENTITY_TYPE.PLAYER,
    animations: {
      idle: {
        frames: [0, 1, 2, 3],
        frameRate: 8
      },
      walk: {
        frames: [3, 4, 5, 6, 7],
        frameRate: 16
      }
    }
  },
  {
    id: "standard_npc",
    type: ENTITY_TYPE.NPC,
    animations: {
      idle: {
        frames: [0, 1, 2, 3],
        frameRate: 8
      },
      walk: {
        frames: [3, 4, 5, 6, 7],
        frameRate: 16
      }
    }
  },
  {
    id: "standard_potion",
    type: ENTITY_TYPE.PICKUP,
    animations: {
      idle: {
        frames: [89],
        frameRate: 1
      }
    }
  }
]