import { dataAssets, getStoreItem } from "kontra";
import m from "mithril";
import { ENTITY_TYPE } from "../common/consts";
import { groupBy } from "../common/helpers";

let mounted = false;

/* still deciding how to work the UI either with
sngular instances of mithril or otherwise. */
const Shell = ({ attrs }) => {
  // TODO: May be better to do a query method in the store instead as it's more flexible.
  const itemsInStore = getStoreItem("entities").filter(
    x => x.type === ENTITY_TYPE.PICKUP
  );

  const dataKey = "assets/gameData/entityData.json";
  const itemsInData = dataAssets[dataKey];

  const groupedItems = groupBy(itemsInStore, "id");
  const remapped = Object.entries(groupedItems).map(([k, v], i) => {
    console.log(k, v);
    return {
      id: k,
      data: v,
      qty: v.length
    };
  });

  return {
    oninit: () => (mounted = true),
    onremove: () => (mounted = false),
    view: () =>
      m("div", { class: "uiShell" }, [
        m("div", { class: "dialogueBoxOuter" }, [
          m("div", { class: "dialogue" }, [
            remapped.length
              ? m(
                  "dl",
                  { class: "itemListing" },
                  remapped.map(item => {
                    const data = itemsInData.find(({ id }) => id === item.id);
                    const qty = item ? item.qty : 0;

                    return m(
                      "dd",
                      {
                        class: "itemNode",
                        onclick: () => attrs.onItemSelected(data)
                      },
                      [
                        m("img", { src: data.thumb }),
                        m("h4", `${data.name}: x${qty}`),
                        m("h5", data.description)
                      ]
                    );
                  })
                )
              : m("p", "No items."),
            m(
              "div",
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
  };
};

export default {
  isBusy: () => mounted,
  mount: (attrs = {}) => {
    m.mount(document.getElementById("ui"), {
      view: () => m(Shell, attrs)
    });
  },
  unmount: () => m.mount(document.getElementById("ui"), null)
};
