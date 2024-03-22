import Tree, { RawNodeDatum, TreeNodeDatum, CustomNodeElementProps, TreeProps } from "react-d3-tree";
import { Button, Flex, Input, Popover } from "antd";
import { NodeExpandOutlined, NodeCollapseOutlined, EditOutlined } from '@ant-design/icons';
import SliderInput from "./SliderInput"; // replaces standard antd components

interface CollapseState {
  collapsed: boolean;
  children?: CollapseState[];
}

class SkillTreeInner extends Tree {
  private isFrozen = false;

  /**
   * Freezes / unfreezes the rendering process.
   * @param frozen whether the tree should be frozen
   */
  setFrozen(frozen: boolean) {
    this.isFrozen = frozen;
  }

  /**
   * Determines whether the class component can re-render.
   * @returns whether the component can re-render
   */
  shouldComponentUpdate(): boolean {
    return !this.isFrozen;
  }

  /**
   * Handles the node click event:
   * 1) toggles expand/collapse.
   * 2) changes title.
   * 3) changes percentage.
   */
  handleNodeChange: TreeProps['onNodeClick'] = (node, event): RawNodeDatum | null => {
    const dataClone = [...this.state.data];
    const nodeDatum = SkillTreeInner.findNodeInTree(dataClone[0], node.data);

    if (!nodeDatum) {
      return null;
    }

    let isTreeDataModified = true;

    switch (event.type) {
      case 'toggleNode':
        if (nodeDatum.__rd3t.collapsed) {
          SkillTreeInner.expandNode(nodeDatum);
        } else {
          SkillTreeInner.collapseNode(nodeDatum);
        }
        isTreeDataModified = false;
        break;

      case 'changePercent':
        nodeDatum.progressPercent = Number((event.target as HTMLInputElement).value);
        SkillTreeInner.updatePercentages(dataClone[0]); // triggers update cascade
        break;

      case 'changeName':
        nodeDatum.name = (event.target as HTMLInputElement).value;
        break;

      default:
        break;
    }

    if (isTreeDataModified) {
      return dataClone[0]; // expose altered root node for re-rendering
    }

    this.setState({ data: dataClone });
    return null;
  };

  /**
 * Updates percentages at node by calling
 * the recursive inner function.
 */
  static updatePercentages(nodeDatum: TreeNodeDatum) {
    const generatePercentagesAtNode = (nodeDatum: RawNodeDatum): number => {
      if (nodeDatum.children) {
        const childrenPercentageSum = nodeDatum.children.reduce((acc: number, current: RawNodeDatum) => {
          return acc + generatePercentagesAtNode(current);
        }, 0);
        nodeDatum.progressPercent = childrenPercentageSum / nodeDatum.children.length;
      }
      return nodeDatum.progressPercent;
    };
    generatePercentagesAtNode(nodeDatum);
  }

  /**
   * Finds the target node in the designated subtree.
   * @param currentNode root node of current subtree
   * @param targetNode target node to find
   * @returns node if found, null if not found
   */
  static findNodeInTree(currentNode: TreeNodeDatum, targetNode: TreeNodeDatum): TreeNodeDatum | null {
    if (currentNode.__rd3t.id == targetNode.__rd3t.id) {
      return currentNode;
    }
    if (currentNode.children) {
      for (let child of currentNode.children) {
        const res = SkillTreeInner.findNodeInTree(child, targetNode);
        if (res) return res;
      }
    }
    return null;
  }

  /**
   * Sets the collapse state of the current tree.
   * @param collapseState collapse state to match
   */
  setCollapseState(collapseState: CollapseState) {
    const setCollapsedState = (node: TreeNodeDatum, currentState: CollapseState) => {
      node.__rd3t.collapsed = currentState.collapsed;
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          setCollapsedState(node.children[i], currentState.children![i]);
        }
      }
    };

    const dataClone = [...this.state.data];
    setCollapsedState(dataClone[0], collapseState);
    this.setState({ data: dataClone });
  }

  /**
   * Gets the collapse state of the current tree.
   * @returns current collapse state
   */
  geteCollapseState(): CollapseState {
    const getCollapsedState = (node: TreeNodeDatum): CollapseState => {
      const state: CollapseState = {
        collapsed: node.__rd3t.collapsed
      };
      if (node.children) {
        state.children = node.children.map((value) => getCollapsedState(value));
      }
      return state;
    };

    const rootNode = this.state.data[0];
    return getCollapsedState(rootNode);
  }

  /**
   * Expands recursively at the target node.
   * @param nodeDatum target node
   */
  static override expandNode(nodeDatum: TreeNodeDatum): void {
    super.expandNode(nodeDatum);
    nodeDatum.children?.forEach(child => SkillTreeInner.expandNode(child));
  }

  /**
   * Generates custom node based on props.
   * @param param0 custom node props
   * @returns svg for the custom node
   */
  static renderRectNode({ nodeDatum, onNodeClick }: CustomNodeElementProps): JSX.Element {
    const width = 180;
    const height = 65;

    return (
      <g>
        {/* Background */}
        <rect width={width} height={height} x={-width / 2} y={-height / 2} fill="white" stroke="none" />

        {/* Progress Bar */}
        <rect width={nodeDatum.progressPercent / 100 * width} height={height} x={-width / 2} y={-height / 2} fill="#9cec5b" stroke="none" />

        {/* Title */}
        <foreignObject x={-width / 2 + 10} y={-height / 2 + 10} width={90} height={30}>
          <Flex align="center">
            <b>{nodeDatum.name}</b>
            <Popover
              content={
                <Input
                  defaultValue={nodeDatum.name}
                  style={{ width: 120 }}
                  onChange={(event) => {
                    event.type = 'changeName';
                    onNodeClick(event);
                  }}
                />
              }
              trigger="click"
            >
              <Button type="link" size="middle" icon={<EditOutlined />} />
            </Popover>
          </Flex>
        </foreignObject>

        {/* Percentage */}
        <foreignObject x={width / 2 - 55} y={height / 2 - 30} width={50} height={20}>
          <Flex justify="flex-end" align="center">
            <p style={{ fontSize: 12 }}>{Math.round(nodeDatum.progressPercent)}%</p>
            {/* Only allow percentage change if at leaf node */}
            {!nodeDatum.children ?
              <Popover
                placement="bottom"
                content={
                  <SliderInput
                    min={0}
                    max={100}
                    defaultValue={nodeDatum.progressPercent}
                    style={{
                      slider: { width: 100 },
                      input: { width: 65 }
                    }}
                    onChange={(event) => {
                      event.type = 'changePercent';
                      onNodeClick(event);
                    }}
                  />
                }
                trigger="click"
              >
                <Button type="link" size="small" icon={<EditOutlined />} />
              </Popover> :
              <div style={{ width: 10 }}></div> // placeholder for aligning percentage label
            }
          </Flex>
        </foreignObject>

        {/* Border */}
        <rect width={width} height={height} x={-width / 2} y={-height / 2} fill="none" stroke="black" />

        {/* Expand / Collapse Btn */}
        {nodeDatum.children &&
          <foreignObject x={width / 2 + 5} y={-16} width={50} height={50}>
            <Button
              type="primary"
              shape="circle"
              icon={nodeDatum.__rd3t.collapsed ? <NodeExpandOutlined /> : <NodeCollapseOutlined />}
              onClick={(event) => {
                event.type = 'toggleNode';
                onNodeClick(event);
              }}
            />
          </foreignObject>
        }
      </g>
    );
  }
}

export default SkillTreeInner;