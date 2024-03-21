import { Ref, useRef, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setSkillset } from "../redux/slices/skillsetSlice";
import Tree, { RawNodeDatum, TreeNodeDatum, CustomNodeElementProps, TreeProps, Point } from "react-d3-tree";
import { Button, Flex, Input, Popover } from "antd";
import { NodeExpandOutlined, NodeCollapseOutlined, EditOutlined } from '@ant-design/icons';
import SliderNum from "./SliderNum"; // replaces standard antd components

interface CollapseState {
  collapsed: boolean;
  children?: CollapseState[];
}

class SkillTreeClass extends Tree {
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
    const nodeDatum = SkillTreeClass.findNodeInTree(dataClone[0], node.data);

    if (!nodeDatum) {
      return null;
    }

    let isTreeDataModified = true;

    switch (event.type) {
      case 'toggleNode':
        if (nodeDatum.__rd3t.collapsed) {
          SkillTreeClass.expandNode(nodeDatum);
        } else {
          SkillTreeClass.collapseNode(nodeDatum);
        }
        isTreeDataModified = false;
        break;

      case 'changePercent':
        nodeDatum.progressPercent = Number((event.target as HTMLInputElement).value);
        SkillTreeClass.updatePercentages(dataClone[0]); // triggers update cascade
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
        const res = SkillTreeClass.findNodeInTree(child, targetNode);
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
    nodeDatum.children?.forEach(child => SkillTreeClass.expandNode(child));
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
                  <SliderNum
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

function SkillTree({ data }: { data: RawNodeDatum; }) {
  const dispatch = useAppDispatch();
  const tree: Ref<SkillTreeClass> = useRef(null);

  const initialZoom = 1;
  const [zoom, setZoom] = useState(initialZoom);
  const initialTranslate: Point = { x: 0, y: 0 };
  const [translate, setTranslate] = useState(initialTranslate);

  return (
    <>
      <SkillTreeClass
        ref={tree}
        data={data}
        renderCustomNodeElement={SkillTreeClass.renderRectNode}
        onNodeClick={(node, event) => {
          const newTreeData = tree.current!.handleNodeChange!(node, event);
          if (newTreeData) {
            const oldCollapseState = tree.current!.geteCollapseState();
            tree.current!.setFrozen(true); // freeze rendering before update finished
            dispatch(setSkillset(newTreeData));
            setTimeout(() => {
              tree.current!.setCollapseState(oldCollapseState);
              tree.current!.setFrozen(false); // allow rendering to continue
            });
          }
        }}
        onUpdate={({ zoom, translate }) => {
          // HACK: the internal d3 state emits default values after component update, filtering out the bad case
          if (zoom != initialZoom || translate.x != initialTranslate.x || translate.y != initialTranslate.y) {
            setZoom(zoom);
            setTranslate(translate);
          }
        }}
        pathFunc="step"
        depthFactor={350}
      />
      {/* Add text showing current zoom level and translation */}
      <Flex align="center" style={{ position: 'absolute', bottom: 12, right: 25, fontSize: 13, color: 'gray' }}>
        <p style={{ textAlign: 'right' }}>{Math.round(zoom * 100)}%</p>
        <code style={{ width: 20, textAlign: 'center' }}>:</code>
        <p style={{ width: 80, textAlign: 'right' }}>{`(${-Math.round(translate.x)}, ${-Math.round(translate.y)})`}</p>
      </Flex>
    </>
  );
}

export default SkillTree;