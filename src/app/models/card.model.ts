export type Status = 'todo' | 'doing' | 'done';

export interface Card {
  id: string;
  title: string;
  owner: string;
  value: number;
}

export interface Board {
  todo: Card[];
  doing: Card[];
  done: Card[];
}
