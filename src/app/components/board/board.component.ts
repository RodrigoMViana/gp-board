import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { BoardService } from '../../services/board.service';
import { Card, Status } from '../../models/card.model';
import { CardFormComponent } from '../card-form/card-form.component';

interface Column {
  key: Status;
  label: string;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, CardFormComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  private readonly svc = inject(BoardService);

  readonly board$ = this.svc.board$;

  readonly columns: Column[] = [
    { key: 'todo', label: 'A fazer' },
    { key: 'doing', label: 'Em andamento' },
    { key: 'done', label: 'Concluído' },
  ];

  readonly connectedTo = this.columns.map((c) => c.key);

  drop(event: CdkDragDrop<Card[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.svc.persistReorder();
  }

  remove(status: Status, id: string): void {
    this.svc.removeCard(status, id);
  }

  subtotal(cards: Card[]): number {
    return cards.reduce((sum, c) => sum + c.value, 0);
  }
}
