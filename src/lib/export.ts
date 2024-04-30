function TreeSVGExport(): string {
  // extract the svg element
  const treeSVG = document.querySelector('svg.rd3t-svg')!;
  const treeSVGClone = treeSVG.cloneNode(true) as SVGElement;
  // fix the links
  const links = treeSVGClone.querySelectorAll('.rd3t-link');
  links.forEach(link => {
    link.setAttribute('fill', 'none');
    link.setAttribute('stroke', 'black');
  });
  // set font-family
  treeSVGClone.setAttribute('style', "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';");
  // remove all class, id, button, and not needed foreignObject
  const removeUnnecessary = (elem: Element): boolean => {
    if (elem.classList.contains('title')) {
      elem.setAttribute('y', '-38');
    } else if (elem.classList.contains('percentage')) {
      const originalX = Number(elem.getAttribute('x')!);
      elem.setAttribute('x', `${originalX + 12}`);
      elem.setAttribute('y', '-5');
      elem.setAttribute('height', '30');
    } else if (elem.tagName == 'foreignObject' || elem.tagName == 'BUTTON') {
      return true; // remove the current element
    }
    const toRemove = [];
    for (const child of elem.children) {
      if (removeUnnecessary(child)) toRemove.push(child);
    }
    toRemove.forEach(child => elem.removeChild(child));
    elem.removeAttribute('class');
    elem.removeAttribute('id');
    return false;
  };
  removeUnnecessary(treeSVGClone);
  // calculate bounds
  const nodes = treeSVGClone.children[0].querySelectorAll('g');
  let minY = Infinity;
  let maxY = 0;
  let maxX = 0;
  nodes.forEach(node => {
    const transform = node.getAttribute('transform');
    if (!transform) return;
    const rightParenthesisPos = transform.indexOf('(');
    const commaPos = transform.indexOf(',');
    const leftParenthesisPos = transform.indexOf(')');
    const xPos = Number(transform.slice(rightParenthesisPos + 1, commaPos));
    const yPos = Number(transform.slice(commaPos + 1, leftParenthesisPos));
    if (yPos < minY) minY = yPos;
    if (yPos > maxY) maxY = yPos;
    if (xPos > maxX) maxX = xPos;
  });
  // set bounds
  treeSVGClone.setAttribute('width', `${maxX + 400}px`);
  treeSVGClone.setAttribute('height', `${maxY - minY + 200}px`);
  treeSVGClone.children[0].setAttribute('transform', `translate(200, ${(maxY - minY) / 2 - 100})`);
  // serialize
  const serializer = new XMLSerializer();
  return serializer.serializeToString(treeSVGClone);
}

async function TreeImageExport(type: 'png' | 'jpeg'): Promise<Uint8Array> {
  // load svg content into img
  const svgContent = TreeSVGExport();
  const imgElement = new Image();
  imgElement.src = 'data:image/svg+xml;base64,' + btoa(svgContent);

  return new Promise((resolve, _reject) => {
    imgElement.onload = async () => {
      // use canvas to convert img into png blob
      const canvas = new OffscreenCanvas(imgElement.width, imgElement.height);
      const context = canvas.getContext('2d')!;
      context.drawImage(imgElement, 0, 0);
      if (type == 'jpeg') { // set the background to be #f6f6f6
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#f6f6f6';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      const imgBlob = await canvas.convertToBlob({ type: 'image/' + type });
      const imgBuffer = await imgBlob.arrayBuffer();
      resolve(new Uint8Array(imgBuffer));
    };
  });
}

export { TreeSVGExport, TreeImageExport };