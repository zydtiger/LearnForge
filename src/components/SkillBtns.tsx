// external imports
import { FloatButton } from 'antd';
import {
  QuestionCircleOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  LogoutOutlined,
  LoginOutlined
} from '@ant-design/icons';

// redux imports
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectLastSaveTime,
  selectIsSaved,
  selectIsUndoable,
  selectIsRedoable,
  undo,
  redo,
} from '../redux/slices/skillsetSlice';
import { exportSkillset, importSkillset, saveSkillset } from '../redux/thunks/skillsetThunks';
import { setIsManualModalOpen } from '../redux/slices/viewSlice';

interface SkillBtnsProps {
  toggleViewBtn: {
    tooltip: string,
    Icon: any,
  };
  onToggleView: () => void;
}

function SkillBtns({ toggleViewBtn, onToggleView }: SkillBtnsProps) {
  const dispatch = useAppDispatch();

  const lastSaveTime = useAppSelector(selectLastSaveTime);
  const isSaved = useAppSelector(selectIsSaved);
  const isUndoable = useAppSelector(selectIsUndoable);
  const isRedoable = useAppSelector(selectIsRedoable);

  return (
    <>
      {/* Import/Export Btns */}
      <FloatButton.Group
        trigger='click'
        style={{ right: 20, bottom: 176 }}
      >
        <FloatButton
          tooltip={"Import"}
          icon={<LoginOutlined />}
          onClick={() => dispatch(importSkillset())}
        />
        <FloatButton
          tooltip={"Export"}
          icon={<LogoutOutlined />}
          onClick={() => dispatch(exportSkillset())}
        />
      </FloatButton.Group>

      {/* Save Btn */}
      <FloatButton
        type={isSaved ? 'default' : 'primary'}
        style={{ right: 20, bottom: 124 }}
        badge={{ dot: !isSaved }}
        tooltip={"Last Saved " + new Date(lastSaveTime).toLocaleString()}
        icon={<SaveOutlined />}
        onClick={() => dispatch(saveSkillset())}
      />

      {/* Help Btn */}
      <FloatButton
        style={{ right: 20, bottom: 72 }}
        tooltip={"View Manual"}
        icon={<QuestionCircleOutlined />}
        onClick={() => dispatch(setIsManualModalOpen(true))}
      />

      {/* Toggle View Btn */}
      <FloatButton
        type="primary"
        style={{ right: 20, bottom: 20 }}
        tooltip={toggleViewBtn.tooltip}
        icon={toggleViewBtn.Icon}
        onClick={onToggleView}
      />

      {/* Undo / Redo Btns */}
      <FloatButton
        type={isUndoable ? "primary" : "default"}
        style={{ left: 20, bottom: 72 }}
        tooltip={"Undo"}
        icon={<UndoOutlined />}
        onClick={() => dispatch(undo())}
      />
      <FloatButton
        type={isRedoable ? "primary" : "default"}
        style={{ left: 20, bottom: 20 }}
        tooltip={"Redo"}
        icon={<RedoOutlined />}
        onClick={() => dispatch(redo())}
      />
    </>
  );
}

export default SkillBtns;