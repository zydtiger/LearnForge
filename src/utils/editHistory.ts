const MaxHistoryLength = 100;

export class EditHistory<T> {
  stack: EditHistoryOnce<T>[] = [];
  stackIndex: number = -1;

  /**
   * Initializes history class in stack.
   * @param name name of history to create at first
   * @param maxLength max length to keep for first history
   */
  constructor(name: string, maxLength = MaxHistoryLength) {
    this.create(name, maxLength);
  }

  /**
   * Returns name of current history.
   * @returns string representing current name in use
   */
  name(): string {
    return this.currentHistory().name;
  }

  /**
   * Creates a new history in stack.
   * @param name name of history to create
   * @param maxLength max length to keep
   */
  create(name: string, maxLength = MaxHistoryLength) {
    this.stack.push(new EditHistoryOnce<T>(name, maxLength));
    this.stackIndex++;
  }

  /**
   * Destroys topmost history in stack.
   */
  destroy() {
    if (this.stackIndex >= 0) {
      this.stack.pop();
      this.stackIndex--;
    }
  }

  /**
   * Returns current history operating at.
   * @returns topmost history in stack
   */
  currentHistory(): EditHistoryOnce<T> {
    return this.stack[this.stackIndex];
  }

  /**
   * Pushes in a new generic state.
   * @param state new state
   */
  push(state: T) {
    this.currentHistory().push(state);
  }

  /**
   * Clears current history.
   */
  clear() {
    this.currentHistory().clear();
  }

  /**
   * Returns current history record.
   * @returns current state or null if not exist
   */
  current(): T | null {
    return this.currentHistory().current();
  }

  /**
   * Returns current history length.
   * @returns length
   */
  length(): number {
    return this.currentHistory().length();
  }

  /**
   * Undos current history and loads to target ref if provided.
   */
  undo(targetRef: T | null = null) {
    this.currentHistory().undo(targetRef);
  }

  /**
   * Redos current history and loads to target ref if provided.
   */
  redo(targetRef: T | null = null) {
    this.currentHistory().redo(targetRef);
  }

  /**
   * Returns whether the current history status is undo-able.
   * @returns is undo-able
   */
  isUndoable(): boolean {
    return this.currentHistory().isUndoable();
  }

  /**
   * Returns whether the current history status is redo-able.
   * @returns is redo-able
   */
  isRedoable(): boolean {
    return this.currentHistory().isRedoable();
  }
}

export class EditHistoryOnce<T> {
  name: string;
  historyIndex = -1;
  history: T[] = [];
  maxLength: number;

  /**
   * Initializes history class.
   * @param name name of history
   * @param maxLength max length of history records
   */
  constructor(name: string, maxLength = MaxHistoryLength) {
    this.name = name;
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
