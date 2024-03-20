import { useState, Ref, useRef, CSSProperties } from "react";
import { InputNumber } from "antd"
import { SyntheticEventHandler } from "react-d3-tree";

interface NumEditProps {
  min: number,
  max: number,
  defaultValue: number,
  onChange: SyntheticEventHandler,
  style: CSSProperties
}

function NumEdit({ min, max, defaultValue, onChange, style }: NumEditProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef: Ref<HTMLInputElement> = useRef(null);

  return (
    <>
      {/* Dummy element for event firing */}
      <input type="number" ref={inputRef} hidden={true} value={value} onClick={onChange} readOnly />
      <InputNumber min={min} max={max} defaultValue={value} style={style} onChange={(value) => {
        setValue(value ?? 0);
        setTimeout(() => inputRef.current!.click()) // manually trigger event
      }} />
    </>
  )
}

NumEdit.defaultProps = {
  min: 0,
  max: 100,
  defaultValue: 0,
  onChange: () => { },
  style: {}
} as NumEditProps;

export default NumEdit;