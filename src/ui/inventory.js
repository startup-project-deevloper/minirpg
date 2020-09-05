import { dataAssets, getStoreItem } from "kontra";
import m from "mithril";
import { ENTITY_TYPE } from "../common/consts";

let mounted = false;

/* still deciding how to work the UI either with
sngular instances of mithril or otherwise. */
const Shell = ({ attrs }) => {
    const itemsInStore = getStoreItem("entities")
        .filter(x => x.type === ENTITY_TYPE.PICKUP);
        
    const dataKey = "assets/gameData/entityData.json";
    const itemsInData = dataAssets[dataKey];

    return {
        oninit: () => mounted = true,
        onremove: () => mounted = false,
        view: () =>
            m("div", { class: "uiShell" }, [
                m("div", { class: "dialogueBoxOuter" }, [
                    m("div", { class: "dialogue" }, [
                        itemsInStore.length ? m("dl",
                            { class: "itemListing" },
                            itemsInStore.map(item => {
                                const data = itemsInData.find(({ id }) => id === item.id);
                                const qty = item ? item.qty : 0;

                                return m("dd", {
                                    class: "itemNode",
                                    onclick: () => attrs.onItemSelected(data)
                                }, [
                                    m("img", { src: data.thumb }),
                                    m("h4", `${data.name}: x${qty}`),
                                    m("h5", data.description)
                                ])
                            })
                        ) : m("p", "No items."),
                        m("div",
                            { class: "choiceWindow" },
                            m(
                                "button",
                                {
                                    class: "choiceBox",
                                    onclick: () => attrs.onInventoryClosed()
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