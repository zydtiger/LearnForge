const MaxHistoryLength = 100;
const DefaultSensitivity = 0;

export class EditHistory<T> {
  historyIndex = -1;
  history: T[] = [];
  maxLength: number;
  sensitivity: number;
  sensitivityCnt: number = 0;

  /**
   * Initializes history class.
   * @param maxLength max length of history records
   * @param sensitivity no. of pushes to skip
   */
  constructor(maxLength = MaxHistoryLength, sensitivity = DefaultSensitivity) {
    this.maxLength = maxLength;
    this.sensitivity = sensitivity;
  }

  /**
   * Pushes in a new generic state.
   * @param state new state
   */
  push(state: T) {
    if (this.sensitivityCnt > 0) {
      this.sensitivityCnt--;
      return;
    }
    this.sensitivityCnt = this.sensitivity;

    // in the middle of undo/redo chain
    if (this.historyIndex != this.length() - 1) {
      this.history.splice(this.historyIndex + 1); // discards everything after
    }
    // maintains history to be smaller than max length
    if (this.length() > this.maxLength) {
      this.history.splice(0, 1);
      this.historyIndex--;
    }
    this.history.push(state);
    this.historyIndex++;
  }

  /**
   * Clears all history records.
   */
  clear() {
    this.historyIndex = -1;
    this.history = [];
  }

  /**
   * Returns current history record.
   * @returns current state or null if not exist
   */
  current(): T | null {
    return this.historyIndex != -1 ? this.history[this.historyIndex] : null;
  }

  /**
   * Returns history length.
   * @returns length
   */
  length(): number {
    return this.history.length;
  }

  /**
   * Undos the history and loads to target ref if provided.
   */
  undo(targetRef: T | null = null) {
    if (this.isUndoable()) {
      this.historyIndex--;
      if (targetRef) {
        Object.assign(targetRef, this.current());
      }
    }
  }

  /**
   * Redos the history and loads to target ref if provided.
   */
  redo(targetRef: T | null = null) {
    if (this.isRedoable()) {
      this.historyIndex++;
      if (targetRef) {
        Object.assign(targetRef, this.current());
      }
    }
  }

  /**
   * Returns whether the history status is undo-able.
   * @returns is undo-able
   */
  isUndoable(): boolean {
    return this.historyIndex > 0;
  }

  /**
   * Returns whether the history status is redo-able.
   * @returns is redo-able
   */
  isRedoable(): boolean {
    return this.historyIndex != this.history.length - 1;
  }
}
