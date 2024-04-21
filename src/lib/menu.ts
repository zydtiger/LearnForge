import store, { AppDispatch } from '../redux/store';
import { importSkillset, exportSkillset, saveSkillset, undo, redo, setSkillsetNodeById } from '../redux/slices/skillsetSlice';
import { setViewMode, setIsManualModalOpen, selectViewMode, selectPrevViewBeforeNote } from '../redux/slices/viewSlice';
import { undo as noteUndo, redo as noteRedo } from '../redux/slices/noteSlice';
import { MenuProps } from 'antd';
import MenuItem from '../components/MenuItem';
import { selectNoteViewNode } from '../redux/slices/noteSlice';

interface Actions {
  [key: string]: {
    shortcuts: string[],
    exec: (dispatch: AppDispatch) => void;
  };
}

const actions: Actions = {
  import: {
    shortcuts: ["ctrl+o"],
    exec: async (dispatch: AppDispatch) => {
      await dispatch(importSkillset());

      // quits note if view mode is note
      const viewMode = selectViewMode(store.getState());
      if (viewMode == 'note') {
        const prevView = selectPrevViewBeforeNote(store.getState());
        dispatch(setViewMode(prevView));
      }
    }
  },
  export: {
    shortcuts: ["ctrl+e"],
    exec: (dispatch: AppDispatch) => dispatch(exportSkillset())
  },
  save: {
    shortcuts: ["ctrl+s"],
    exec: (dispatch: AppDispatch) => {
      const viewMode = selectViewMode(store.getState());

      // saves note node to tree if in note
      if (viewMode == 'note') {
        const newNode = selectNoteViewNode(store.getState());
        const prevView = selectPrevViewBeforeNote(store.getState());
        dispatch(setSkillsetNodeById(newNode));
        dispatch(setViewMode(prevView));
      } else {
        dispatch(saveSkillset());
      }
    }
  },
  undo: {
    shortcuts: ["ctrl+z"],
    exec: (dispatch: AppDispatch) => {
      const viewMode = selectViewMode(store.getState());

      if (viewMode == 'note') {
        dispatch(noteUndo());
      } else {
        dispatch(undo());
      }
    }
  },
  redo: {
    shortcuts: ["ctrl+shift+z", "ctrl+y"],
    exec: (dispatch: AppDispatch) => {
      const viewMode = selectViewMode(store.getState());

      if (viewMode == 'note') {
        dispatch(noteRedo());
      } else {
        dispatch(redo());
      }
    }
  },
  reset: {
    shortcuts: ["ctrl+r"],
    exec: (_dispatch: AppDispatch) => window.location.reload()
  },
  tree: {
    shortcuts: ["ctrl+t"],
    exec: (dispatch: AppDispatch) => dispatch(setViewMode('tree'))
  },
  list: {
    shortcuts: ["ctrl+l"],
    exec: (dispatch: AppDispatch) => dispatch(setViewMode('list'))
  },
  help: {
    shortcuts: ["ctrl+h"],
    exec: (dispatch: AppDispatch) => dispatch(setIsManualModalOpen(true))
  }
};

/**
 * Process menu items to display shortcuts along with title.
 * @param srcItems items to convert
 * @returns converted items
 */
function convertMenuToDisplayMode(srcItems: MenuProps['items']): MenuProps['items'] {
  const items = [...srcItems!];
  const levelContainsChildren = items.map((item) => 'children' in item!).reduce((acc, cur) => acc ||= cur);
  for (const item of items) {
    if (levelContainsChildren) {
      if ('children' in item!) item.children = convertMenuToDisplayMode(item.children);
    } else if ('label' in item! && typeof item.label == 'string') {
      const actionKey = item.key! as string;
      if (actionKey in actions) {
        // show action label and shortcut together
        item.label = MenuItem({ actionLabel: item.label, shortcuts: actions[actionKey].shortcuts });
      } else console.error("Action key is not defined by handler");
    }
  }
  return items;
}

/**
 * Converts shortcuts to platform-specific notations.
 * @param shortcuts shortcuts to convert
 * @returns converted shortcut, 'ctrl' for non-Mac, 'cmd' for Mac
 */
function convertToPlatformShortcuts(shortcuts: string[]): string[] {
  const isMacOS = window.navigator.userAgent.indexOf('Mac') != -1;
  return shortcuts.map((shortcut) => {
    return isMacOS ? shortcut.replace('ctrl', 'cmd') : shortcut;
  });
}

/**
 * Binds shortcuts to events.
 */
function bindShortcuts(dispatch: AppDispatch) {
  window.onkeydown = (event) => {
    const modifier = window.navigator.userAgent.indexOf('Mac') != -1 ? event.metaKey : event.ctrlKey;
    if (!modifier) return;
    for (const name in actions) {
      const action = actions[name];
      for (const shortcut of action.shortcuts) {
        const shortcutKeys = shortcut.split('+');
        let targetKey = shortcutKeys[1] == 'shift' ? shortcutKeys[2].toUpperCase() : shortcutKeys[1];
        if (event.key == targetKey) {
          action.exec(dispatch);
          return;
        }
      }
    };
  };
}

/**
 * Invokes action with given key.
 * @param key the action key to invoke
 * @param dispatch the redux dispatch hook to use
 */
function invokeAction(key: string, dispatch: AppDispatch) {
  if (key in actions) actions[key].exec(dispatch);
  else console.error('Invoked a non-existing action!');
}

export { actions, convertMenuToDisplayMode, convertToPlatformShortcuts, bindShortcuts, invokeAction };