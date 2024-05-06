import { KeyboardEventHandler, useEffect } from 'react';
import { FloatButton, Typography } from "antd";
import { CheckOutlined, UndoOutlined, RedoOutlined } from "@ant-design/icons";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { getCodeString } from 'rehype-rewrite';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectPrevViewBeforeNote,
  selectViewMode,
  setViewMode
} from '../redux/slices/viewSlice';
import {
  selectNoteViewNode,
  selectIsNoteSaved,
  selectIsUndoable,
  selectIsRedoable,
  updateMarkdownNote,
  updateName,
  undo,
  redo
} from '../redux/slices/noteSlice';
import { setSkillsetNodeById } from '../redux/slices/skillsetSlice';
import katex from 'katex';

function SkillNote() {
  const nodeDatum = useAppSelector(selectNoteViewNode);
  const isNoteSaved = useAppSelector(selectIsNoteSaved);
  const isUndoable = useAppSelector(selectIsUndoable);
  const isRedoable = useAppSelector(selectIsRedoable);

  const viewMode = useAppSelector(selectViewMode);
  const prevView = useAppSelector(selectPrevViewBeforeNote);

  const dispatch = useAppDispatch();

  const quitToPrev = () => {
    dispatch(setViewMode(prevView)); // quits note view
  };

  const handleDone = () => {
    dispatch(setSkillsetNodeById(nodeDatum));
    quitToPrev();
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key == 'Escape') {
      quitToPrev();
    }
  };

  useEffect(() => {
    // auto focus on the editor if note view is shown
    if (viewMode == 'note') {
      document.querySelector('textarea')?.focus();
    }
  }, [viewMode]);

  return (
    <div
      onKeyDown={handleKeyDown}
      data-color-mode="light"
      style={{ padding: 30 }}
    >
      <Typography.Title
        level={2}
        editable={{
          onChange: (value) => {
            dispatch(updateName(value));
          }
        }}
        style={{ top: 0, left: 0 }}
      >
        {nodeDatum.name}
      </Typography.Title>

      {/* Editor */}
      <MDEditor
        height={'calc(100vh - 145px)'}
        visibleDragbar={false}
        value={nodeDatum.mdNote}
        onChange={(val) => dispatch(updateMarkdownNote(val!))}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
          components: {
            // KATEX rendering
            li: ({ children = [], className }) => {
              if (typeof children === 'string' && /^\$(.*)\$/.test(children)) {
                const html = katex.renderToString(children.replace(/^\$(.*)\$/, '$1'), { throwOnError: false, output: 'mathml' });
                return <li dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent' }} />;
              }
              return <li className={String(className)}>{children}</li>
            },
            p: ({ children = [], className }) => {
              if (typeof children === 'string' && /^\$(.*)\$/.test(children)) {
                const html = katex.renderToString(children.replace(/^\$(.*)\$/, '$1'), { throwOnError: false, output: 'mathml' });
                return <p dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent' }} />;
              }
              return <p className={String(className)}>{children}</p>
            },
            code: ({ children = [], className, ...props }) => {
              const code = props.node && props.node.children ? getCodeString(props.node.children) : children;
              if (
                typeof code === 'string' &&
                typeof className === 'string' &&
                /^language-katex/.test(className.toLocaleLowerCase())
              ) {
                const html = katex.renderToString(code, { throwOnError: false, output: 'mathml', displayMode: true });
                return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
              }
              return <code className={String(className)}>{children}</code>;
            },
          },

        }}
      />

      {/* Functional Btns */}
      <>
        {/* Save Btn */}
        <FloatButton
          type={isNoteSaved ? 'default' : 'primary'}
          style={{ right: 20, bottom: 20 }}
          tooltip="Done"
          icon={<CheckOutlined />}
          onClick={handleDone}
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
    </div>
  );
}

export default SkillNote;