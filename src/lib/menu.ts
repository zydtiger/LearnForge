import store from '../redux/store';
import { importSkillset, exportSkillset, saveSkillset, undo, redo, setSkillsetNodeById } from '../redux/slices/skillsetSlice';
import { setViewMode, setIsManualModalOpen, selectViewMode, selectPrevViewBeforeNote } from '../redux/slices/viewSlice';
import { undo as noteUndo, redo as noteRedo } from '../redux/slices/noteSlice';
import { MenuProps } from 'antd';
import MenuItem from '../components/MenuItem';
import { selectNoteViewNode } from '../redux/slices/noteSlice';

interface Actions {
  [key: string]: {
    shortcuts: string[],
    exec: () => void;
  };
}

// define actions, this will automatically show in manual modal
const actions: Actions = {
  find: {
    shortcuts: ["ctrl+f"],
    exec: () => { } // don't do anything as default behavior is what we need
  },
  import: {
    shortcuts: ["ctrl+o"],
    exec: async () => {
      await store.dispatch(importSkillset());

      // quits note if view mode is note
      const viewMode = selectViewMode(store.getState());
      if (viewMode == 'note') {
        const prevView = selectPrevViewBeforeNote(store.getState());
        store.dispatch(setViewMode(prevView));
      }
    }
  },
  export: {
    shortcuts: ["ctrl+e"],
    exec: () => store.dispatch(exportSkillset())
  },
  save: {
    shortcuts: ["ctrl+s"],
    exec: () => {
      const viewMode = selectViewMode(store.getState());

      // saves note node to tree if in note
      if (viewMode == 'note') {
        const newNode = selectNoteViewNode(store.getState());
        const prevView = selectPrevViewBeforeNote(store.getState());
        store.dispatch(setSkillsetNodeById(newNode));
        store.dispatch(setViewMode(prevView));
      }

      store.dispatch(saveSkillset());
    }
  },
  undo: {
    shortcuts: ["ctrl+z"],
    exec: () => {
      const viewMode = selectViewMode(store.getState());

      if (viewMode == 'note') {
        store.dispatch(noteUndo());
      } else {
        store.dispatch(undo());
      }
    }
  },
  redo: {
    shortcuts: ["ctrl+shift+z", "ctrl+y"],
    exec: () => {
      const viewMode = selectViewMode(store.getState());

      if (viewMode == 'note') {
        store.dispatch(noteRedo());
      } else {
        store.dispatch(redo());
      }
    }
  },
  reset: {
    shortcuts: ["ctrl+r"],
    exec: () => window.location.reload()
  },
  tree: {
    shortcuts: ["ctrl+t"],
    exec: () => store.dispatch(setViewMode('tree'))
  },
  list: {
    shortcuts: ["ctrl+l"],
    exec: () => store.dispatch(setViewMode('list'))
  },
  help: {
    shortcuts: ["ctrl+h"],
    exec: () => store.dispatch(setIsManualModalOpen(true))
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
function bindShortcuts() {
  window.onkeydown = (event) => {
    const modifier = window.navigator.userAgent.indexOf('Mac') != -1 ? event.metaKey : event.ctrlKey;
    if (!modifier) return;
    for (const name in actions) {
      const action = actions[name];
      for (const shortcut of action.shortcuts) {
        const shortcutKeys = shortcut.split('+');
        let targetKey = shortcutKeys[1] == 'shift' ? shortcutKeys[2].toUpperCase() : shortcutKeys[1];
        if (event.key == targetKey) {
          action.exec();
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
function invokeAction(key: string) {
  if (key in actions) actions[key].exec();
  else console.error('Invoked a non-existing action!');
}

export { actions, convertMenuToDisplayMode, convertToPlatformShortcuts, bindShortcuts, invokeAction };