import "modern-normalize/modern-normalize.css";
import "./style.css";

const grid = document.getElementById("grid") as HTMLDivElement;

const gridElementSize = 35;

let elements = new Map<string, HTMLDivElement>();

let affectedElements: HTMLDivElement[] = [];
let x: number;
let y: number;

const setupGrid = () => {
  grid.innerHTML = "";
  x = Math.floor(window.innerWidth / gridElementSize);
  y = Math.floor(window.innerHeight / gridElementSize);
  grid.style.setProperty("--grid-x", x.toString());
  grid.style.setProperty("--grid-y", y.toString());
  for (let iy = 0; iy < y; iy++) {
    for (let ix = 0; ix < x; ix++) {
      const gridElement = document.createElement("div");
      gridElement.classList.add("grid-element");
      grid.appendChild(gridElement);
      elements.set(`${ix}:${iy}`, gridElement);
      gridElement.style.setProperty("--x", ix.toString());
      gridElement.style.setProperty("--y", iy.toString());
    }
  }
};

setupGrid();
window.addEventListener("resize", setupGrid);

const radius = 3;

window.addEventListener("mousemove", (e) => {
  const elX = Math.floor(e.clientX / gridElementSize);
  const elY = Math.floor(e.clientY / gridElementSize);
  affectedElements.forEach((el) => el.style.removeProperty("--power"));
  affectedElements = [];
  for (
    let ix = Math.max(elX - (radius + 1), 0);
    ix <= Math.min(elX + (radius + 1), x - 1);
    ix++
  ) {
    for (
      let iy = Math.max(elY - (radius + 1), 0);
      iy <= Math.min(elY + (radius + 1), y - 1);
      iy++
    ) {
      const el = elements.get(`${ix}:${iy}`)!;
      const distance = Math.hypot(
        ix * gridElementSize - e.clientX,
        iy * gridElementSize - e.clientY
      );
      if (distance < radius * gridElementSize)
        el.style.setProperty("--power", "1");
      else if (distance < (radius + 1) * gridElementSize)
        el.style.setProperty(
          "--power",
          (
            (((radius + 1) * gridElementSize - distance) / gridElementSize) *
              0.66 +
            0.33
          ).toString()
        );

      affectedElements.push(el);
    }
  }
});
