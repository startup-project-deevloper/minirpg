import { dataAssets, getStoreItem } from "kontra";
import m from "mithril";

let mounted = false;

/* still deciding how to work the UI either with
sngular instances of mithril or otherwise. */
const Shell = ({ attrs }) => {
    const questsInStore = getStoreItem("quests");
    const dataKey = "assets/gameData/questData.json";
    const questsInData = dataAssets[dataKey];
    
    return {
        oninit: () => mounted = true,
        onremove: () => mounted = false,
        view: () =>
            m("div", { class: "uiShell" }, [
                m("div", { class: "dialogueBoxOuter" }, [
                    m("div", { class: "dialogue" }, [
                        questsInStore.length ? m("dl",
                            { class: "questListing" },
                            questsInStore.map(({ props }) => {
                                const data = questsInData.find(({ id }) => id === props.questId);
                                const currentSegment = data.parts.find(p => p.index === props.questPart);

                                return m("dd", {
                                    class: "questNode",
                                    onclick: () => attrs.onQuestSelected(data)
                                }, [
                                    m("h4", data.name),
                                    m("h5", currentSegment.description)
                                ])
                            })
                        ) : m("p", "No quests."),
                        m("div",
                            { class: "choiceWindow" },
                            m(
                                "button",
                                {
                                    class: "choiceBox",
                                    onclick: () => attrs.onQuestlogClosed()
                                },
                                "Close"
                            )
                        )
                    ])
                ])
            ])
    }
}

export default {
    isBusy: () => mounted,
    mount: (attrs = {}) => {
        m.mount(document.getElementById("ui"), {
            view: () => m(Shell, attrs)
        })
    },
    unmount: () => m.mount(document.getElementById("ui"), null)
}