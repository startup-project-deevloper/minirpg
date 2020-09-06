import talkOnly from "./scripts/talkOnly";
import npcRoam from "./scripts/npcRoam";

export default useScript => {
  const scriptList = [
    {
      id: "talkOnly",
      scr: talkOnly
    },
    {
      id: "npcRoam",
      scr: npcRoam
    }
  ];

  const loadedScript = useScript
    ? scriptList.find(x => x.id === useScript).scr()
    : scriptList[0].scr();

  return {
    bootstrap: props => loadedScript.bootstrap(props),
    start: () => loadedScript.start(),
    update: () => loadedScript.update(),
    onConvoEnter: () => loadedScript.onConvoEnter(),
    onConvoExit: () => loadedScript.onConvoExit(),
    onBattleEnter: () => {},
    onBattleExit: () => {}
  };
};
