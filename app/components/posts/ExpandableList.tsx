import { Sandpack } from "@codesandbox/sandpack-react";
import { atomDark, githubLight } from "@codesandbox/sandpack-themes";

import React from "react";
import { useTheme } from "~/utils/theme-provider";

export default function ExpandableListSandpack() {
  const [theme] = useTheme();
  return (
    <Sandpack
      theme={theme === "dark" ? atomDark : githubLight}
      files={{
        "/App.js": `
        import ExpandableList from "./ExpandableList";
        const ButtonItem = ({ item }) => (
          <button
            style={{
              padding: "0px 12px",
              margin: "4px 0px",
              border: "1px solid gold",
              borderRadius: "4px",
            }}
          >
            {item.label}
          </button>
        );
        export default function App() {
          return (
            <div>
              <ExpandableList
                items={new Array(50)
                  .fill(0)
                  .map((_, index) => ({ label: "Item #" + index }))}
                renderItem={(item) => <ButtonItem item={item} />}
              />
            </div>
          );
        }
        
        `,
        "/ExpandableList.tsx": `
        import React from "react";
        export default function ExpandableList({ items, renderItem }) {
          const id = "123";
          const observerRef = React.useRef<IntersectionObserver | null>(null);
          const [visibleItemIds, setVisibleItemIds] = React.useState<string[]>(() =>
            items.map((item, i) => id + "item" + i)
          );
        
          const renderItems = () => {
            const itemContainer = document.getElementById(id + "items-container");
            // If the scroll width exceeds the client width => the items overflow!
            // We need to compute the elements to fit only if it overflows
            // Else they all fit in the container and we don't need to do anything
            if (
              itemContainer &&
              itemContainer?.scrollWidth >= itemContainer?.clientWidth
            ) {
              observerRef.current = new IntersectionObserver(
                (entries) => {
                  setVisibleItemIds(() =>
                    entries
                      .filter((entry) => entry.isIntersecting)
                      .map((entry) => entry.target.id)
                  );
                },
                {
                  root: itemContainer,
                  rootMargin: "0px",
                  threshold: 1.0,
                }
              );
        
              items.forEach((_, index) => {
                const target = document.getElementById(id + "item" + index);
                if (target) {
                  observerRef.current?.observe(target);
                }
              });
            }
          };
        
          const handleExpansion = (): void => {
            setVisibleItemIds(() => items.map((_, index) => id + "item" + index));
            // Once the user has clicked to view all items, disconnect the observer
            observerRef.current?.disconnect();
            const itemContainer = document.getElementById(id + "items-container");
            if (itemContainer) {
              itemContainer.style.flexWrap = "wrap";
              itemContainer.style.overflowX = "visible";
            }
          };
        
          React.useEffect(() => {
            renderItems();
          }, []);
        
          return (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  id={id + "items-container"}
                  style={{
                    maxWidth: "90%",
                    display: "flex",
                    gap: "8px",
                    overflowX: "hidden",
                  }}
                >
                  {items.slice(0, visibleItemIds.length).map((item, index) => (
                    <div id={id + "item" + index} key={id + "item" + index}>
                      {renderItem(item)}
                    </div>
                  ))}
                </div>
                {items.length !== visibleItemIds.length && (
                  <button
                    style={{ background: "none", borderRadius: "50%", border: "none" }}
                    onClick={handleExpansion}
                  >
                    +{items.length - visibleItemIds.length}
                  </button>
                )}
              </div>
            </>
          );
        }
        `,
      }}
      template="react"
    />
  );
}

export const ExpandableList = ({
  items,
  renderItem,
}: {
  items: Array<unknown>;
  renderItem: (item: unknown) => React.ReactNode;
}) => {
  // const id = React.useId();
};
