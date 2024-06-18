/**
 * Extracts tree view into svg content.
 * @returns svg content in string
 */
function TreeSVGExport(): string {
  // extract the svg element
  const treeSVG = document.querySelector("svg.rd3t-svg")!;
  const treeSVGClone = treeSVG.cloneNode(true) as SVGElement;
  // fix the links
  const links = treeSVGClone.querySelectorAll(".rd3t-link");
  links.forEach((link) => {
    link.setAttribute("fill", "none");
    link.setAttribute("stroke", "black");
  });
  // set font-family
  treeSVGClone.setAttribute(
    "style",
    "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';",
  );
  // remove all class, id, button, and not needed foreignObject
  const removeUnnecessary = (elem: Element): boolean => {
    if (elem.classList.contains("title")) {
      elem.setAttribute("y", "-38");
    } else if (elem.classList.contains("percentage")) {
      const originalX = Number(elem.getAttribute("x")!);
      elem.setAttribute("x", `${originalX + 12}`);
      elem.setAttribute("y", "-5");
      elem.setAttribute("height", "30");
    } else if (elem.tagName == "foreignObject" || elem.tagName == "BUTTON") {
      return true; // remove the current element
    }
    const toRemove = [];
    for (const child of elem.children) {
      if (removeUnnecessary(child)) toRemove.push(child);
    }
    toRemove.forEach((child) => elem.removeChild(child));
    elem.removeAttribute("class");
    elem.removeAttribute("id");
    return false;
  };
  removeUnnecessary(treeSVGClone);
  // calculate bounds
  const nodes = treeSVGClone.children[0].querySelectorAll("g");
  let minYPos = Infinity;
  let minYHeight = 0;
  let maxYPos = 0;
  let maxYHeight = 0;
  let minXPos = Infinity;
  let minXWidth = 0;
  let maxXPos = 0;
  let maxXWidth = 0;
  nodes.forEach((node) => {
    const transform = node.getAttribute("transform");
    if (!transform) return;
    const rightParenthesisPos = transform.indexOf("(");
    const commaPos = transform.indexOf(",");
    const leftParenthesisPos = transform.indexOf(")");
    const xPos = Number(transform.slice(rightParenthesisPos + 1, commaPos));
    const yPos = Number(transform.slice(commaPos + 1, leftParenthesisPos));
    if (yPos < minYPos) {
      minYPos = yPos;
      minYHeight = Number(node.querySelector("rect")?.getAttribute("height"));
    }
    if (yPos > maxYPos) {
      maxYPos = yPos;
      maxYHeight = Number(node.querySelector("rect")?.getAttribute("height"));
    }
    if (xPos < minXPos) {
      minXPos = xPos;
      minXWidth = Number(node.querySelector("rect")?.getAttribute("width"));
    }
    if (xPos > maxXPos) {
      maxXPos = xPos;
      maxXWidth = Number(node.querySelector("rect")?.getAttribute("width"));
    }
  });
  const padding = 100;
  const minYBound = minYPos - minYHeight / 2;
  const maxYBound = maxYPos + maxYHeight / 2;
  const minXBound = minXPos - minXWidth / 2;
  const maxXBound = maxXPos + maxXWidth / 2;
  const width = maxXBound - minXBound + 2 * padding;
  const height = maxYBound - minYBound + 2 * padding;
  const rootCoord = [padding + minXWidth / 2, padding - minYBound];
  // set bounds
  treeSVGClone.setAttribute("width", `${width}px`);
  treeSVGClone.setAttribute("height", `${height}px`);
  treeSVGClone.children[0].setAttribute(
    "transform",
    `translate(${rootCoord[0]}, ${rootCoord[1]})`,
  );
  // serialize
  const serializer = new XMLSerializer();
  return serializer.serializeToString(treeSVGClone);
}

/**
 * Extracts tree view into image through svg.
 * @param type specify which type of image to export to
 * @returns promise of image byte array
 */
async function TreeImageExport(type: "png" | "jpeg"): Promise<Uint8Array> {
  // load svg content into img
  const svgContent = TreeSVGExport();
  const imgElement = new Image();
  imgElement.src = "data:image/svg+xml;base64," + btoa(svgContent);

  return new Promise((resolve, _reject) => {
    imgElement.onload = async () => {
      // use canvas to convert img into png blob
      const canvas = new OffscreenCanvas(imgElement.width, imgElement.height);
      const context = canvas.getContext("2d")!;
      context.drawImage(imgElement, 0, 0);
      if (type == "jpeg") {
        // set the background to be #f6f6f6
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = "#f6f6f6";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      const imgBlob = await canvas.convertToBlob({ type: "image/" + type });
      const imgBuffer = await imgBlob.arrayBuffer();
      resolve(new Uint8Array(imgBuffer));
    };
  });
}

export { TreeSVGExport, TreeImageExport };
