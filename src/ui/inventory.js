import { dataAssets } from "kontra";
import m from "mithril";

let mounted = false;

/* still deciding how to work the UI either with
sngular instances of mithril or otherwise. */
const Shell = ({ attrs }) => {

    const dataKey = "assets/gameData/entityData.json";
    const itemsInData = dataAssets[dataKey];

    return {
        oninit: () => console.log("Opened inventory."),
        view: () =>
            m("div", { class: "uiShell" }, [
                m("dl",
                    { class: "itemListing" },
                    attrs.items.map(item => {
                        const assetData = itemsInData.find(({ id }) => id === item.assetId);
                        return m("dd", {
                            class: "itemNode",
                            onclick: () => attrs.onItemSelected({
                                ...item,
                                assetData
                            })
                        }, assetData.name)
                    })
                ),
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
    }
}

export default {
    isBusy: () => mounted,
    mount: (attrs = {}) => {
        mounted = true;
        m.mount(document.getElementById("ui"), {
            view: () => m(Shell, attrs)
        })
    },
    unmount: () => {
        mounted = false;
        m.mount(document.getElementById("ui"), null);
    },
}