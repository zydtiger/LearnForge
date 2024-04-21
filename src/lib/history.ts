const MaxHistoryLength = 100;

export class EditHistory<T> {
  historyIndex = -1;
  history: T[] = [];
  maxLength: number;

  /**
   * Initializes history class.
   * @param maxLength maximum no. of history records
   */
  constructor(maxLength = MaxHistoryLength) {
    this.maxLength = maxLength;
  }

  /**
   * Pushes in a new generic state.
   * @param state new state
   */
  push(state: T) {
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
   * Returns current history record.
   * @returns current state or null if not exist
   */
  current(): T | null {
    return this.historyIndex != -1 ? this.history[this.historyIndex] : null;
  }

  /**
   * Returns current history length.
   * @returns length
   */
  length(): number {
    return this.history.length;
  }

  /**
   * Undos the history.
   */
  undo() {
    if (this.isUndoable()) {
      this.historyIndex--;
    }
  }

  /**
   * Redos the history.
   */
  redo() {
    if (this.isRedoable()) {
      this.historyIndex++;
    }
  }

  /**
   * Returns whether the history status is undo-able.
   * @returns is undo-able
   */
  isUndoable(): boolean {
    return this.historyIndex != 0;
  }

  /**
   * Returns whether the history status is redo-able.
   * @returns is redo-able
   */
  isRedoable(): boolean {
    return this.historyIndex != this.history.length - 1;
  }
}