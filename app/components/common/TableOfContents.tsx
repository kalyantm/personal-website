import React from "react";

const getSection = (section: string) =>
  section
    .split(" ")
    .map((el) => el.toLowerCase())
    .join("-");

export default function TableOfContents({
  sections,
  windowHash,
}: {
  sections: Array<string>;
  windowHash: string;
}) {
  const [hash, setHash] = React.useState<string>(windowHash);
  const observerRef = React.useRef<any>();
  console.log("post section", sections);
  console.log(
    "getting",
    sections.map((p) => getSection(p))
  );
  React.useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // if intersecting, set to current intersecting value always
        // if not intersecting, check y: if +ve, that means scroll dir is up - switch to previous section
        // else, do nothing
        // scroll up
        if (entry.isIntersecting) {
          setHash(entry.target.id);
        } else {
          if (
            entry.boundingClientRect.y > 0 &&
            entries.filter((e) => e.isIntersecting).length === 0
          ) {
            const sectionIdx = sections.findIndex(
              (s) => entry.target.id === getSection(s)
            );
            setHash(
              sectionIdx - 1 > 0
                ? getSection(sections[sectionIdx - 1])
                : getSection(sections[0])
            );
          }
        }
      });
    });

    sections
      .map((section: string) => getSection(section))
      .forEach((section: string) =>
        observerRef.current?.observe(document.querySelector(`#${section}`))
      );
  }, [sections]);

  return (
    <aside className="sticky top-32 hidden self-start md:-mr-16 md:ml-16 md:flex">
      <div>
        <h2 className="mb-4">Table of contents</h2>
        <ul>
          {sections.map((section: string) => (
            <li className="mb-4" key={section}>
              <a
                href={`#${getSection(section)}`}
                className={`text-left ${
                  hash === `${getSection(section)}`
                    ? "text-accent"
                    : "text-primary"
                }`}
              >
                {section}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
