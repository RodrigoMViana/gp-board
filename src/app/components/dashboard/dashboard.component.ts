import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

import { BoardService } from '../../services/board.service';
import { Board, Card } from '../../models/card.model';

interface StageView {
  key: string;
  label: string;
  count: number;
  value: number;
  pctOfTotal: number;
}

interface Summary {
  total: number;
  donePct: number;
  stages: StageView[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly svc = inject(BoardService);

  readonly summary$ = this.svc.board$.pipe(map((board) => this.toSummary(board)));

  private sum(cards: Card[]): number {
    return cards.reduce((acc, c) => acc + c.value, 0);
  }

  private toSummary(board: Board): Summary {
    const todo = this.sum(board.todo);
    const doing = this.sum(board.doing);
    const done = this.sum(board.done);
    const total = todo + doing + done;
    const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

    return {
      total,
      donePct: pct(done),
      stages: [
        { key: 'todo', label: 'A fazer', count: board.todo.length, value: todo, pctOfTotal: pct(todo) },
        { key: 'doing', label: 'Em andamento', count: board.doing.length, value: doing, pctOfTotal: pct(doing) },
        { key: 'done', label: 'Concluído', count: board.done.length, value: done, pctOfTotal: pct(done) },
      ],
    };
  }
}
