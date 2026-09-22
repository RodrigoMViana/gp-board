import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board, Card, Status } from '../models/card.model';

const STORAGE_KEY = 'gp-board.state.v1';

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function seed(): Board {
  return {
    todo: [
      { id: newId(), title: 'Levantar requisitos do módulo financeiro', owner: 'Ana', value: 6800 },
      { id: newId(), title: 'Prototipar tela de login', owner: 'Rodrigo', value: 3200 },
    ],
    doing: [
      { id: newId(), title: 'Integração com API de pagamentos', owner: 'Rodrigo', value: 9500 },
    ],
    done: [
      { id: newId(), title: 'Setup do projeto e CI', owner: 'Marcos', value: 2500 },
    ],
  };
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly state$ = new BehaviorSubject<Board>(this.load());

  /** Stream of the current board, for the async pipe. */
  readonly board$: Observable<Board> = this.state$.asObservable();

  private load(): Board {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Board) : seed();
    } catch {
      return seed();
    }
  }

  private commit(board: Board): void {
    this.state$.next(board);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    } catch {
      /* storage may be unavailable — the app still works in-memory */
    }
  }

  get snapshot(): Board {
    return this.state$.value;
  }

  addCard(card: Omit<Card, 'id'>): void {
    const board = this.snapshot;
    board.todo = [{ ...card, id: newId() }, ...board.todo];
    this.commit({ ...board });
  }

  removeCard(status: Status, id: string): void {
    const board = this.snapshot;
    board[status] = board[status].filter((c) => c.id !== id);
    this.commit({ ...board });
  }

  /** Persist the current state after a drag-and-drop reorder. */
  persistReorder(): void {
    this.commit({ ...this.snapshot });
  }
}
